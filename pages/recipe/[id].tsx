import { useRouter } from "next/router";
import { useQuery, useMutation } from "@tanstack/react-query";
import { Recipe } from "../../types/types";
import { useSession } from "next-auth/react";
import { fetchJson } from "../../lib/api";

const RECIPE_QUERY_KEY = "recipe";

const fetchRecipe = async (id: string) => {
	try {
		const recipe = await fetchJson(`/api/recipe?id=${id}`, {});
		return recipe;
	} catch (error) {
		throw error;
	}
};

const saveRecipe = async ({ recipe, id }: { recipe: Recipe; id: string }) => {
	try {
		await fetchJson(`/api/saveRecipe?id=${id}`, {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
			},
			body: JSON.stringify(recipe),
		})
	} catch (error) {
		throw error;
	}
};

const RecipeIntermediatePage: React.FC = () => {
	const router = useRouter();
	const { id } = router.query;

	const { data: session, status } = useSession();

	const { isLoading, isError, data, error } = useQuery<Recipe, Error>(
		[RECIPE_QUERY_KEY],
		() => fetchRecipe(id as string),
		{
			enabled: id === undefined ? false : true,
		}
	);

	const mutation = useMutation((savedRecipe: { recipe: Recipe; id: string }) =>
		saveRecipe(savedRecipe)
	);

	const handldeSave = async () => {
		mutation.mutate({
			recipe: data!,
			id: session!.id as string,
		});
	};

	if (isLoading) {
		return (
			<div className="flex h-52 items-end justify-center mx-3">
				<div className="font-bold text-2xl">Loading...</div>
			</div>
		);
	}

	if (isError) {
		return (
			<div className="flex h-52 items-end justify-center mx-3">
				<div className="font-bold text-2xl">Error: {error.message}</div>
			</div>
		);
	}

	return (
		<div className="lg:mt-5 2xl:mt-10 flex flex-col justify-center items-center">
			<div className="bg-green-50 rounded lg:w-2/3 px-5 py-32 flex flex-col gap-3 items-center shadow-lg">
				<a
					className="cursor-pointer underline text-center text-2xl"
					href={`${data.sourceUrl}`}
					rel="noreferrer"
					target="_blank"
				>
					Click here to view the full recipe for{" "}
					<span className="font-semibold">{data.title}</span>!
				</a>
				<div className="text-2xl">If you like the recipe, you can:</div>
				<div className="flex gap-6 shrink-0">
					<div
						onClick={handldeSave}
						className="border border-black max-w-full font-semibold p-2 rounded-lg hover:bg-black hover:text-white cursor-pointer underline"
					>
						Save Recipe
					</div>
					<div className="border border-black max-w-full  font-semibold p-2 rounded-lg hover:bg-black hover:text-white cursor-pointer underline">
						Share Your Result!
					</div>
				</div>
				{mutation.isLoading && (
					<div>
						<div className="font-bold text-2xl">Saving...</div>
					</div>
				)}
				{mutation.isError && (
					<div>
						<div className="font-bold text-2xl">Error, try again later</div>
					</div>
				)}
				{mutation.isSuccess && (
					<div>
						<div className="font-bold text-2xl text-green-500">Saved!</div>
					</div>
				)}
			</div>
		</div>
	);
};

export default RecipeIntermediatePage;
