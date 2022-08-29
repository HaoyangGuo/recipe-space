import type { NextApiRequest, NextApiResponse } from "next";
import { Recipe } from "../../types/types";

export default async function handler(
	req: NextApiRequest,
	res: NextApiResponse<Recipe[]>
) {
	const { ingredients } = req.query;
	try {
		const response = await fetch(
			`https://api.spoonacular.com/recipes/findByIngredients?ingredients=${ingredients}&number=20&apiKey=${process.env.SPOONACULAR_API_KEY}`
		);
		const recipes = (await response.json()) as Recipe[];
		res.status(200).json(recipes);
	} catch (error: any) {
		res.status(500).send(error.message);
	}
}
