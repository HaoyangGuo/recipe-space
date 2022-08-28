import { useRouter } from "next/router";
import { useQuery } from "@tanstack/react-query";
import { Recipe } from "../../types/types";

const RECIPE_QUERY_KEY = "recipe";

const fetchRecipe = async (id: string) => {
	try {
		const response = await fetch(`/api/recipe?id=${id}`);
		if (!response.ok) {
			throw new Error(response.statusText);
		}
		const recipe = await response.json();
		return recipe;
	} catch (error) {
		console.error(error);
		return undefined;
	}
};

const RecipeIntermediatePage: React.FC = () => {
	const router = useRouter();
	const { id } = router.query;

	const { isLoading, isError, data, error } = useQuery<Recipe, Error>(
		[RECIPE_QUERY_KEY],
		() => fetchRecipe(id as string)
	);

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
		<div className="border lg:mt-5 2xl:mt-10 flex flex-col justify-center items-center">
			<div className="bg-white rounded w-2/3 p-5">
				<a
					className="cursor-pointer underline text-center"
					href={`${data.sourceUrl}`}
					rel="noreferrer"
					target="_blank"
				>
					Click here to view the full recipe for{" "}
					<span className="font-semibold">{data.title}</span>!
				</a>
				<div>If you like the recipe, you can:</div>
				<div className="bg-green-500 max-w-fit font-semibold p-3 rounded-lg">Save Recipe</div>
				<div className="bg-pink-500 max-w-fit  font-semibold p-3 rounded-lg">Share Your Result!</div>
			</div>
		</div>
	);
};

export default RecipeIntermediatePage;
