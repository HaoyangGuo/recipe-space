import { useEffect } from "react";
import { useAtom } from "jotai";
import { useQuery } from "@tanstack/react-query";
import { useRouter } from "next/router";
import { ingredientsListAtom } from "../components/IngredientsForm";
import { Ingredient, Recipe } from "../types/types";
import IngredientsRecipeButton from "../components/IngredientsRecipeButton";

const INGREDIENTS_QUERY_KEY = "ingredient_recipes";

const fetchRecipesByIngredients = async (ingredients: string[]) => {
	try {
		const response = await fetch(
			`/api/recipesByIngredients?ingredients=${ingredients.join(",")}`
		);
		if (!response.ok) {
			throw new Error(response.statusText);
		}
		const recipes = await response.json();
		return recipes;
	} catch (error) {
		console.error(error);
		return undefined;
	}
};

const ResultPage = () => {
	const [ingredients] = useAtom(ingredientsListAtom);
	const router = useRouter();

	useEffect(() => {
		if (!ingredients || ingredients.length === 0) {
			router.push({
				pathname: "/search",
			});
		}
	}, [ingredients, router]);

	const { isLoading, isError, data, error } = useQuery<Recipe[], Error>(
		[INGREDIENTS_QUERY_KEY],
		() => fetchRecipesByIngredients(ingredients)
	);

	if (isLoading) {
		return (
			<div className="flex h-52 items-end justify-center mx-3">
				<div className="font-bold text-2xl">Searching recipes for you...</div>
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
		<div className="flex flex-col items-start lg:mt-5 2xl:mt-10 gap-3">
			<div className="bg-white p-3 min-w-full rounded-md shadow-md flex flex-col">
				<div className="text-xl">Your ingredients: </div>
				<div className="max-w-full flex flex-wrap gap-1">
					{ingredients.map((ingredient, i) => (
						<span
							key={i}
							className="text-sm font-semibold bg-green-200 px-2 py-1 rounded-md mt-2"
						>
							{ingredient}
						</span>
					))}
				</div>
			</div>
			{ingredients.length > 0 ? (
				<div className="text-xl font-semibold">
					Here are 20 recipes using your ingredients:{" "}
				</div>
			) : (
				<div className="text-xl font-semibold">
					Please provide at least 1 ingredient!
				</div>
			)}
			{data.map((recipe: Recipe, i: number) => (
				<IngredientsRecipeButton key={i} recipe={recipe} />
			))}
		</div>
	);
};

export default ResultPage;
