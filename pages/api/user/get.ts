import type { NextApiRequest, NextApiResponse } from "next";
import { unstable_getServerSession } from "next-auth";
import { options } from "../auth/[...nextauth]";
import { User, Recipe } from "../../../types/types";
import { prisma } from "../../../lib/prisma";

export default async function handler(
	req: NextApiRequest,
	res: NextApiResponse
) {
	const { id } = req.query;
	const session = await unstable_getServerSession(req, res, options);
	if (session && session.id === id) {
		try {
			const response = await prisma.user.findUnique({
				where: {
					id: id as string,
				},
				include: {
					savedRecipes: true,
					posts: true,
				},
			});
			res.status(200).json(response);
		} catch (error: any) {
			res.status(500).send(error.message);
		}
	} else {
		res.status(401).send({ Unauthorized: "You are not logged in" });
	}
}
