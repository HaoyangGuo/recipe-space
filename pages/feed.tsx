import { fetchJson } from "../lib/api";
import { useSession, signIn } from "next-auth/react";
import { useMutation } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { Post, User } from "../types/types";
import { fetchUser } from "./user/[id]";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { USER_QUERY_KEY } from "./user/[id]";

const POSTS_QUERY_KEY = "posts";

const createPost = async ({ post, id }: { post: Post; id: string }) => {
	try {
		const image = new FormData();
		image.append("file", post.image[0]);

		const { imageUrl, imagePublicId } = await fetchJson(
			`/api/uploadImage?id=${id}`,
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
				`/api/createPost?id=${id}&imagePublicId=${imagePublicId}`,
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
			await fetchJson(`/api/deleteImage?id=${id}`, {
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

const fetchPosts = async () => {
	try {
		const posts = await fetchJson(`/api/getPosts`, {});
		return posts;
	} catch (error) {
		throw error;
	}
};

const FeedPage: React.FC = () => {
	const {
		register,
		handleSubmit,
		reset,
		formState: { errors },
	} = useForm<Post>();

	const { data: session, status } = useSession();
	const queryClient = useQueryClient();

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
	} = useQuery<Post[], Error>([POSTS_QUERY_KEY], () => fetchPosts());

	const mutation = useMutation(
		(creatingPost: { post: Post; id: string }) => createPost(creatingPost),
		{
			onSuccess: () => {
				queryClient.invalidateQueries([POSTS_QUERY_KEY]);
				reset();
			},
		}
	);

	const handlePostSubmit = async (data: Post) => {
		await mutation.mutate({ post: data, id: session!.id as string });
	};

	const savedRecipes = data?.savedRecipes;

	return (
		<div className="lg:mt-5 2xl:mt-10">
			<div className="text-lg font-semibold bg-green-200 p-5  mb-5 rounded-md lg:sticky lg:top-14">
				This is the query bar
			</div>
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
										Something went wrong, try again later
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
				<div className=" bg-white rounded-md shadow-lg overflow-scroll p-5">
					{isLoading ? (
						<div>Loading...</div>
					) : (
						<div>
							{posts!.map((post, i) => (
								<div key={i}>{post.title}</div>
							))}
						</div>
					)}
					Lorem ipsum dolor sit amet consectetur adipisicing elit. Magni dolores
					hic beatae ducimus provident obcaecati at veritatis delectus
					consequatur ad odio consectetur eaque voluptates exercitationem quod
					ut harum, saepe iste? Et saepe aut optio veritatis ipsam asperiores,
					nisi non totam repellendus consectetur quibusdam error consequuntur
					est dignissimos unde. Ipsa molestias repellendus omnis tenetur eius
					labore at ipsum nihil voluptatibus doloribus. Esse voluptas fugit
					nesciunt nostrum at nihil obcaecati qui rerum inventore minima. Porro
					nobis quidem maiores quibusdam aperiam eveniet, amet suscipit
					excepturi voluptas deserunt minima quaerat ea quisquam voluptatem
					error? Iste accusamus ad, rem ea assumenda necessitatibus provident
					cupiditate in eius molestiae possimus aliquam, nesciunt quidem ipsum
					numquam obcaecati sapiente voluptatum enim alias est delectus suscipit
					ipsa. Cupiditate, assumenda quia? Explicabo, aliquam sit architecto
					pariatur ex repellat voluptates iusto eligendi amet, laborum quos
					ratione ipsa tenetur repudiandae. Iusto odit, veniam similique nihil
					fuga itaque sint nam illo totam eum natus. Ad neque repudiandae odio,
					maxime dolor culpa eaque architecto qui mollitia vero error eos
					facilis deserunt fuga similique nam labore reiciendis corrupti? Non
					officia quia optio excepturi corporis ducimus neque. Quasi quidem
					atque quae, odit at nemo impedit repellendus quas vitae possimus quis
					eveniet assumenda aspernatur eligendi dignissimos consectetur
					voluptatum incidunt qui reiciendis. Veniam hic beatae recusandae,
					cupiditate dolorem soluta. Illum aspernatur doloremque ullam dolore
					cumque et molestias libero, aliquid provident. Consequatur, maiores
					tempora? Quam mollitia vitae totam dolores quas autem repellendus qui
					a excepturi earum! Sit perferendis rerum eum? In consequuntur nobis
					inventore temporibus itaque obcaecati totam ducimus eligendi
					doloremque quae? Commodi aliquam sapiente molestias a vitae quas quia
					iste, minus cupiditate sed deleniti minima veniam repudiandae dicta
					facilis. Corporis minima quod quasi quis eaque exercitationem rerum
					illum corrupti explicabo odio eveniet temporibus aliquam animi
					deserunt nesciunt esse ex perferendis quisquam unde et, quam beatae!
					Nostrum harum repellat vitae. Cum quae maiores possimus quos ipsam
					dolorum sequi quod, praesentium nemo aliquid accusantium ab ut dolorem
					esse vel inventore, minus dicta laborum. Neque expedita error in
					doloremque fugiat assumenda dolore. Nulla expedita natus quas quasi.
					Illum ut eius maiores nobis porro sit dolore tempore delectus sed,
					unde cumque tenetur fugiat. Quibusdam eaque in cupiditate! Recusandae
					quas cumque eos voluptatum tempora. Tenetur neque omnis, magnam totam
					quod quo unde? Repellendus harum commodi unde. Eveniet ullam
					repellendus natus quisquam dolorum. Veniam ipsa voluptate totam enim
					quas laborum repellendus porro similique veritatis aliquam. Voluptatum
					soluta explicabo, sapiente animi molestias accusamus dolorum dolore
					perspiciatis dolores illum quod sequi. Qui praesentium ad eius, nam
					vel eaque eum magni perferendis, hic consectetur, possimus ipsa
					obcaecati ex? Hic consectetur exercitationem voluptates, deserunt,
					aliquam tempora voluptate, aut similique in commodi ipsam? Commodi
					porro et possimus. Nulla necessitatibus voluptatum distinctio ipsa
					rerum expedita, ea obcaecati, incidunt pariatur totam veniam. Maxime,
					similique earum quas modi facilis aliquam laudantium sequi voluptatum
					accusantium mollitia et doloremque. Tempore corporis dolores,
					blanditiis fuga deleniti quibusdam veniam dolorem ex nobis earum
					officiis facilis, eos consequatur! Illum similique voluptatem, minima
					totam ab placeat sit repellendus ipsam dolor quaerat! Natus inventore
					architecto ut labore, est perferendis dolor, perspiciatis ipsam beatae
					quis aut ducimus officiis sit nemo facere. Inventore laboriosam, iste
					doloremque commodi cum odio qui voluptates iusto aut eum nobis odit at
					repellendus, dolorum nihil perspiciatis ab reiciendis cupiditate
					itaque reprehenderit? Excepturi sunt ad ratione sint tenetur.
					Exercitationem tenetur impedit et quae recusandae saepe quaerat, ab
					similique laudantium, perspiciatis asperiores, laboriosam fugiat!
					Impedit eius, quia soluta, vitae itaque magni deleniti alias pariatur
					a iure rem eveniet illo. Nemo illum illo non. Incidunt, excepturi
					numquam itaque ad provident quod rem tempore? Possimus nostrum esse
					quis voluptatem architecto nesciunt praesentium, ipsa sunt, cupiditate
					quisquam perspiciatis, molestiae deserunt. Quo, commodi.
				</div>
			</div>
		</div>
	);
};

export default FeedPage;
