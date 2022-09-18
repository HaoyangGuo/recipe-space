import type { NextApiRequest, NextApiResponse } from "next";
import { prisma } from "../../../lib/prisma";

export default async function handler(
	req: NextApiRequest,
	res: NextApiResponse
) {
	try {
		const { id } = req.query;
		if (!id) {
			res.status(400).send({ "Bad Request": "Missing required fields" });
			return;
		}
		const response = await prisma.post.findUnique({
			where: {
				id: id.toString(),
			},
			include: {
				recipe: true,
				likedBy: true,
				author: true,
			},
		});
		res.status(200).json(response);
	} catch (error: any) {
		res.status(500).send(error.message);
	}
}
