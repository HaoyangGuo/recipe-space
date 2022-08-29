import { useEffect } from "react";
import { useRouter } from "next/router";
import { useAtom } from "jotai";
import { useQuery } from "@tanstack/react-query";
import { QueryAtom } from "../components/QueryForm";
import { RecipeQuery } from "../components/QueryForm";
import { Recipe } from "../types/types";
import QueryRecipeButton from "../components/QueryRecipeButton";
import { fetchJson } from "../lib/api";

const QUERY_QUERY_KEY = "query_recipes";

const fetchRecipesByQuery = async (query: RecipeQuery) => {
	try {
		const recipes = await fetchJson(
			`/api/recipesByQuery?name=${query.name}&cuisine=${query.cuisine}&diet=${query.diet}`, {}
		);
		return recipes;
	} catch (error) {
		throw error;
	}
};

const QueryResultPage: React.FC = () => {
	const [query] = useAtom(QueryAtom);
	const router = useRouter();

	useEffect(() => {
		if (!query) {
			router.push({
				pathname: "/search",
			});
		}
	}, [query, router]);

	const { isLoading, isError, data, error } = useQuery<Recipe[], Error>(
		[QUERY_QUERY_KEY],
		() => fetchRecipesByQuery(query)
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
				<div className="text-xl">Your selections: </div>
				<div className="max-w-full flex flex-wrap gap-1">
					<span className="text-sm font-semibold bg-green-200 px-2 py-1 rounded-md mt-2">
						Name: {query?.name}
					</span>
					<span className="text-sm font-semibold bg-green-200 px-2 py-1 rounded-md mt-2">
						Cuisine: {query?.cuisine}
					</span>
					<span className="text-sm font-semibold bg-green-200 px-2 py-1 rounded-md mt-2">
						Diet: {query?.diet}
					</span>
				</div>
			</div>
			{data.length > 0 ? (
				<div className="text-xl font-semibold">
					Here are some recipes you may like:
				</div>
			) : (
				<div className="text-xl font-semibold">Sorry, no recipes found</div>
			)}
			<div className="w-full grid grid-cols-2 gap-5 sm:grid-cols-3 self-center">
				{data.map((recipe: Recipe, i: number) => (
					<QueryRecipeButton key={i} recipe={recipe} />
				))}
			</div>
		</div>
	);
};

export default QueryResultPage;
