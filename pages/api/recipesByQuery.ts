import type { NextApiRequest, NextApiResponse } from "next";
import { Recipe } from "../../types/types";

export default async function handler(
	req: NextApiRequest,
	res: NextApiResponse<Recipe[]>
) {
	const { name, cuisine, diet } = req.query;
	try {
		const response = await fetch(
			`https://api.spoonacular.com/recipes/complexSearch?query=${name}&cuisine=${cuisine}&diet=${diet}&number=20&apiKey=${process.env.SPOONACULAR_API_KEY}`
		);
		if (!response.ok) {
			throw new Error(response.statusText);
		}
		const data = await response.json();
		const recipes = data.results as Recipe[];
		res.status(200).json(recipes);
	} catch (error: any) {
		res.status(500).send(error.message);
	}
}
