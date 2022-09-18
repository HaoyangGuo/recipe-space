import FilledHeartIcon from "../public/icons/unlike.svg";
import EmptyHeartIcon from "../public/icons/like.svg";
import { fetchJson } from "../lib/api";
import Image from "next/image";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/router";

interface PostProps {
	userId: string;
	postId: string;
}

const POST_QUERY_KEY = "post";

const getPost = async ({ postId }: { postId: string }) => {
	try {
		const post = await fetchJson(`/api/post/get/?id=${postId}`, {});
		return post;
	} catch (error) {
		throw error;
	}
};

const likePost = async ({
	postId,
	userId,
}: {
	postId: string;
	userId: string;
}) => {
	try {
		await fetchJson(`/api/post/like?postId=${postId}&userId=${userId}`, {
			method: "POST",
		});
	} catch (error) {
		throw error;
	}
};

const unlikePost = async ({
	postId,
	userId,
}: {
	postId: string;
	userId: string;
}) => {
	try {
		await fetchJson(`/api/post/unlike?postId=${postId}&userId=${userId}`, {
			method: "POST",
		});
	} catch (error) {
		throw error;
	}
};

const PostComponent: React.FC<PostProps> = ({ postId, userId }) => {
	const queryClient = useQueryClient();
	const Router = useRouter();

	const {
		data: post,
		isLoading,
		isError,
	} = useQuery<any, Error>([POST_QUERY_KEY, postId], () => getPost({ postId }));

	const likePostMutation = useMutation(
		(likingPost: { postId: string; userId: string }) => likePost(likingPost),
		{
			onSuccess: () => {
				queryClient.invalidateQueries([POST_QUERY_KEY, postId]);
			},
		}
	);

	const unlikePostMutation = useMutation(
		(unlikingPost: { postId: string; userId: string }) =>
			unlikePost(unlikingPost),
		{
			onSuccess: () => {
				queryClient.invalidateQueries([POST_QUERY_KEY, postId]);
			},
		}
	);

	function handleLikeButtonClick() {
		likePostMutation.mutate({ postId, userId });
	}

	function handleUnlikeButtonClick() {
		unlikePostMutation.mutate({ postId, userId });
	}


	if (isLoading) {
		return <div></div>;
	}

	let likedByCurrentUser = false;
	for (let i = 0; i < post.likedBy.length; i++) {
		if (post.likedBy[i].id === userId) {
			likedByCurrentUser = true;
		}
	}

	return (
		<div className="rounded-md bg-gray-100 z-0 flex flex-col justify-between h-fit">
			<div className="self-center w-full relative">
				<div className="absolute z-10 right-5 top-5 flex gap-1 items-center">
					<div className="text-lg text-white">{post.likedBy.length}</div>
					{likedByCurrentUser ? (
						<div className="cursor-pointer" onClick={handleUnlikeButtonClick}>
							<FilledHeartIcon width={24} height={24} fill={"#fff"} />
						</div>
					) : (
						<div className="cursor-pointer" onClick={handleLikeButtonClick}>
							<EmptyHeartIcon width={24} height={24} fill={"#fff"} />
						</div>
					)}
				</div>
				<div className="relative z-5 block">
					<Image
						className="rounded-md bg-white"
						src={post.imageUrl}
						alt={post.title}
						width={250}
						height={250}
						layout={"responsive"}
					/>
				</div>
			</div>
			<div className="flex flex-col p-3">
				<div className="m-auto xl:m-0 font-semibold">{post.title}</div>
				<div className="text-gray-400 m-auto xl:m-0 text-sm">
					{post.author.name}
				</div>
				<div
					className="m-auto xl:m-0 underline hover:text-blue-600 text-sm cursor-pointer"
					onClick={() => {
						Router.push(`/recipe/${post.recipe.id}`);
					}}
				>
					Recipe - {post.recipe.title}
				</div>
				<div className="break-words">{post.content}</div>
			</div>
		</div>
	);
};

export default PostComponent;
