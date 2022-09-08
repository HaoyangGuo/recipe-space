import { Post } from "../types/types";
import { useRouter } from "next/router";
import { useQueryClient, useMutation } from "@tanstack/react-query";
import { fetchJson } from "../lib/api";
import { useSession } from "next-auth/react";
import { USER_QUERY_KEY } from "../pages/user/[id]";
import Image from "next/image";

const deletePost = async ({
	postId,
	imagePublicId,
	id,
}: {
	postId: string;
	imagePublicId: string;
	id: string;
}) => {
	try {
		await fetchJson(`/api/deletePost?id=${id}`, {
			method: "DELETE",
			headers: {
				"Content-Type": "application/json",
			},
			body: JSON.stringify({ postId, imagePublicId }),
		});
	} catch (error) {
		throw error;
	}
};

const SavedPost: React.FC<Post> = ({ id: postId, title, imagePublicId }) => {
	// const router = useRouter();
	const { data: session } = useSession();
	const queryClient = useQueryClient();

	const handlePostOnClick = () => {
		// router.push(`/recipe/${id}`);
	};

	const mutation = useMutation(
		(deletingPost: { postId: string; imagePublicId: string; id: string }) =>
			deletePost(deletingPost),
		{
			onSuccess: () => {
				queryClient.invalidateQueries([USER_QUERY_KEY]);
			},
		}
	);

	const handleDeleteOnClick = async () => {
		await mutation.mutate({
			postId,
			imagePublicId,
			id: session!.id as string,
		});
	};

	return (
		<div className="border-b-2 border-gray-100 mx-2 px-6 py-3">
			<div className="flex items-center justify-between">
				{mutation.isLoading || mutation.isSuccess ? (
					<div className="text-red-600">Deleting...</div>
				) : (
					<>
						<div
							onClick={handlePostOnClick}
							className="underline cursor-pointer hover:text-blue-400"
						>
								{title}
						</div>
						<Image
							onClick={handleDeleteOnClick}
							className="cursor-pointer"
							src={"/icons/trash.png"}
							alt={"delete"}
							width={20}
							height={20}
						/>
					</>
				)}
			</div>
		</div>
	);
};

export default SavedPost;
