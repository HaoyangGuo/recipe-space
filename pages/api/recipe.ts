import type { NextApiRequest, NextApiResponse } from "next";
import { Recipe } from "../../types/types";

export default async function handler(
	req: NextApiRequest,
	res: NextApiResponse<Recipe>
) {
	const { id } = req.query;
	try {
		const response = await fetch(
			`https://api.spoonacular.com/recipes/${id}/information?apiKey=${process.env.SPOONACULAR_API_KEY}`
		);
		const recipe = (await response.json()) as Recipe;
		res.status(200).json(recipe);
	} catch (error: any) {
		res.status(500).send(error.message);
	}
}
