import type { NextApiRequest, NextApiResponse } from "next";
import { Recipe } from "../../types/types";
import { fetchJson } from "../../lib/api";

export default async function handler(
	req: NextApiRequest,
	res: NextApiResponse<Recipe[]>
) {
	const { ingredients } = req.query;
	try {
		const recipes = await fetchJson(
			`https://api.spoonacular.com/recipes/findByIngredients?ingredients=${ingredients}&number=20&apiKey=${process.env.SPOONACULAR_API_KEY}`, {}
		) as Recipe[];
		res.status(200).json(recipes);
	} catch (error: any) {
		res.status(500).send(error.message);
	}
}
