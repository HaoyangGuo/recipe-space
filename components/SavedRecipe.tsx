import { Recipe } from "../types/types";
import { useRouter } from "next/router";
import { useQueryClient, useMutation } from "@tanstack/react-query";
import { fetchJson } from "../lib/api";
import { useSession } from "next-auth/react";
import { USER_QUERY_KEY } from "../pages/user/[id]";
import Image from "next/image";

const unsaveRecipe = async ({ recipe, id }: { recipe: Recipe; id: string }) => {
	try {
		await fetchJson(`/api/deleteSavedRecipe?id=${id}`, {
			method: "DELETE",
			headers: {
				"Content-Type": "application/json",
			},
			body: JSON.stringify(recipe),
		});
	} catch (error) {
		throw error;
	}
};

const SavedRecipe: React.FC<Recipe> = ({ id, title, image }) => {
	const router = useRouter();
	const { data: session } = useSession();
	const queryClient = useQueryClient();

	const handleRecipeOnClick = () => {
		router.push(`/recipe/${id}`);
	};

	const mutation = useMutation(
		(savedRecipe: { recipe: Recipe; id: string }) => unsaveRecipe(savedRecipe),
		{
			onSuccess: () => {
				queryClient.invalidateQueries([USER_QUERY_KEY]);
			},
		}
	);

	const handleDeleteOnClick = async () => {
		await mutation.mutate({
			recipe: { id, title, image },
			id: session!.id as string,
		});
	};

	return (
		<div className="border-b-2 border-gray-100 mx-2 px-6 py-3">
			<div className="flex items-center justify-between">
				<div
					onClick={handleRecipeOnClick}
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
			</div>
			{mutation.isLoading && <div className="text-red-600">Deleting...</div>}
		</div>
	);
};

export default SavedRecipe;
