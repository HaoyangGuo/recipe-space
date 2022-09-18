import { fetchJson } from "../lib/api";
import { useSession, signIn } from "next-auth/react";
import { useMutation } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { Post, User } from "../types/types";
import { fetchUser } from "./user/[id]";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { USER_QUERY_KEY } from "./user/[id]";
import { atom, useAtom } from "jotai";
import PostComponent from "../components/Post";

const POSTS_QUERY_KEY = "posts";

const createPost = async ({ post, id }: { post: Post; id: string }) => {
	try {
		const image = new FormData();
		image.append("file", post.image[0]);

		const { imageUrl, imagePublicId } = await fetchJson(
			`/api/image/upload?id=${id}`,
			{
				method: "POST",
				body: image,
			}
		);

		if (!imageUrl || !imagePublicId) {
			throw new Error("Image upload failed");
		}
		try {
			await fetchJson(
				`/api/post/create?id=${id}&imagePublicId=${imagePublicId}`,
				{
					method: "POST",
					headers: {
						"Content-Type": "application/json",
					},
					body: JSON.stringify({
						recipe: post.recipe,
						title: post.title,
						imageUrl: imageUrl,
						content: post.content,
					}),
				}
			);
		} catch (error) {
			await fetchJson(`/api/image/delete?id=${id}`, {
				method: "DELETE",
				headers: {
					"Content-Type": "application/json",
				},
				body: {
					imagePublicId,
				},
			});
			throw error;
		}
	} catch (error) {
		throw error;
	}
};

const fetchPosts = async (sortingMethod: string) => {
	try {
		const posts = await fetchJson(`/api/posts/get?by=${sortingMethod}`, {});
		const displayPosts = posts.map((post: any) => ({
			...post,
			author: post.author.name,
		}));
		return displayPosts;
	} catch (error) {
		throw error;
	}
};

export const SortingMethodAtom = atom<string>("mostrecent");

const FeedPage: React.FC = () => {
	const {
		register,
		handleSubmit,
		reset,
		formState: { errors },
	} = useForm<Post>();

	const { data: session, status } = useSession();
	const userId = session?.id as string;
	const queryClient = useQueryClient();

	const [sortingMethod, updateSortingMethod] = useAtom(SortingMethodAtom);
	function handleSortingMethodChange(e: any) {
		updateSortingMethod(e.target.value);
	}

	const { data } = useQuery<User, Error>(
		[USER_QUERY_KEY],
		() => fetchUser(session!.id as string),
		{
			enabled: status === "authenticated",
		}
	);

	const {
		isLoading,
		isError,
		data: posts,
		refetch,
	} = useQuery<Post[], Error>([POSTS_QUERY_KEY, sortingMethod], () =>
		fetchPosts(sortingMethod)
	);

	const mutation = useMutation(
		(creatingPost: { post: Post; id: string }) => createPost(creatingPost),
		{
			onSuccess: () => {
				queryClient.invalidateQueries([POSTS_QUERY_KEY]);
				reset();
			},
			onSettled: () => {
				mutation.reset();
			},
		}
	);

	const handlePostSubmit = async (data: Post) => {
		await mutation.mutate({ post: data, id: session!.id as string });
	};

	const savedRecipes = data?.savedRecipes;

	return (
		<div className="lg:mt-5 2xl:mt-10">
			<div className="flex flex-col lg:justify-start lg:flex-row gap-5 lg:gap-10">
				<div>
					<div className="bg-white rounded-md shadow-lg lg:w-80 p-5">
						<div className="text-lg font-semibold">
							Share your result with the community!
						</div>
						{status === "authenticated" ? (
							<form
								onSubmit={handleSubmit(handlePostSubmit)}
								className="flex flex-col gap-2 bg-gray-100 py-3 px-3 rounded-sm mt-4"
							>
								<label>
									Recipe:
									<select
										{...register("recipe", {
											required: {
												value: true,
												message: "Make sure to save and select a recipe",
											},
										})}
										className="px-2 py-1 block bg-gray-300 rounded shadow-sm w-full"
									>
										<option value="">-- Select a recipe --</option>
										{savedRecipes &&
											savedRecipes?.length > 0 &&
											savedRecipes?.map((recipe, i) => (
												<option key={i} value={recipe.id}>
													{recipe.title}
												</option>
											))}
									</select>
								</label>
								{errors.recipe && (
									<div className="text-red-500">*{errors.recipe.message}</div>
								)}
								<label>
									Title:
									<input
										{...register("title", {
											required: {
												value: true,
												message: "Title cannot be empty!",
											},
											maxLength: {
												value: 50,
												message: "Title cannot be longer than 50 charaters!",
											},
										})}
										className="px-2 py-1 block bg-gray-300 rounded shadow-sm w-full"
									/>
								</label>
								{errors.title && (
									<div className="text-red-500">*{errors.title.message}</div>
								)}
								<label>
									Image:
									<input
										className="block max-w-full"
										{...register("image", {
											required: {
												value: true,
												message: "Image cannot be empty!",
											},
											validate: {
												checkSize: (value) => {
													return (
														(value && value[0].size <= 5000000) ||
														"Image is too large"
													);
												},

												checkType: (value) => {
													return (
														(value &&
															(value[0].type === "image/jpeg" ||
																value[0].type === "image/png" ||
																value[0].type === "image/jpg")) ||
														"Image must be a jpeg or png"
													);
												},
											},
										})}
										type="file"
									/>
								</label>
								{errors.image && (
									<div className="text-red-500">*{errors.image.message}</div>
								)}
								<label>
									Content:
									<textarea
										{...register("content", {
											required: {
												value: true,
												message: "Content cannot be empty!",
											},
											maxLength: {
												value: 300,
												message:
													"Content cannot be longer than 300 characters!",
											},
										})}
										className="px-2 py-1 block bg-gray-300 rounded shadow-sm h-24 w-full"
									/>
								</label>
								{errors.content && (
									<div className="text-red-500">*{errors.content.message}</div>
								)}
								{mutation.isLoading && (
									<div className="self-center text-green-500">
										Creating post...
									</div>
								)}
								{mutation.isError && (
									<div className="self-center text-red-600">
										Something went wrong,{" "}
										<span
											className="text-blue-700 underline cursor-pointer"
											onClick={() => mutation.reset()}
										>
											try again
										</span>{" "}
										later
									</div>
								)}
								{mutation.isSuccess && (
									<div className="self-center text-green-500">
										Post created successfully!
									</div>
								)}
								{mutation.isLoading ? (
									<div className="self-center py-1 px-6 text-md font-semibold w-min border rounded-full bg-gray-100">
										Submit
									</div>
								) : (
									<button
										className="self-center cursor-pointer py-1 px-6 text-md font-semibold w-min border rounded-full bg-gray-200 hover:bg-gray-400"
										type="submit"
									>
										Submit
									</button>
								)}
							</form>
						) : (
							<div className="flex flex-col gap-2 bg-gray-100 py-3 px-3 rounded-sm mt-4">
								<div className="text-center font-semibold">
									<div>
										Please{" "}
										<span
											className="underline cursor-pointer hover:text-blue-600"
											onClick={() => signIn("google")}
										>
											Login
										</span>{" "}
										to share your result!
									</div>
								</div>
							</div>
						)}
					</div>
				</div>
				<div className=" bg-white rounded-md shadow-lg overflow-auto p-5 w-full">
					<div className="text-lg font-semibold bg-gray-100 p-5 mb-5 rounded-md flex gap-3 min-w-full">
						<div className="self-start mr-auto">
							Posts
						</div>
						<label htmlFor="sort">Sort By:</label>
						<select
							name="sort"
							value={sortingMethod}
							onChange={handleSortingMethodChange}
							className="px-3 text-center bg-white "
						>
							<option value="mostrecent">most recent</option>
							<option value="mostliked">most liked</option>
						</select>
					</div>
					{isLoading ? (
						<div className="w-full text-center">Loading...</div>
					) : (
						<div className="grid grid-cols-1 xl:grid-cols-2 gap-5">
							{posts!.map((post, i) => (
								<PostComponent key={i} postId={post.id} userId={userId} />
							))}
						</div>
					)}
				</div>
			</div>
		</div>
	);
};

export default FeedPage;
