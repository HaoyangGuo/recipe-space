import type { NextApiRequest, NextApiResponse } from "next";
import { unstable_getServerSession } from "next-auth";
import { options } from "../auth/[...nextauth]";
import { Recipe } from "../../../types/types";
import { prisma } from "../../../lib/prisma";

export default async function handler(
	req: NextApiRequest,
	res: NextApiResponse
) {
	switch (req.method) {
		case "DELETE":
			const { id: recipeId, title, image } = req.body as Recipe;
			const { id } = req.query;
			const session = await unstable_getServerSession(req, res, options);
			if (session && session.id === id) {
				try {
					await prisma.recipe.update({
						where: {
							id: recipeId.toString(),
						},
						data: {
							savedBy: {
								disconnect: {
									id: id as string,
								},
							},
						},
					});

					await prisma.user.update({
						where: {
							id: id as string,
						},
						data: {
							savedRecipes: {
								disconnect: {
									id: recipeId.toString(),
								},
							},
						},
					});

					res.status(200).json({ Success: "Recipe deleted" });
				} catch (error: any) {
					res.status(500).send(error.message);
				}
			} else {
				res.status(401).send({ Unauthorized: "You are not logged in" });
			}
			break;
		default:
			res.status(405).send({ "Method Not Allowed": "Use DELETE" });
	}
}
