import type { NextApiRequest, NextApiResponse } from "next";
import { prisma } from "../../../lib/prisma";

export default async function handler(
	req: NextApiRequest,
	res: NextApiResponse
) {
	const { by } = req.query;
	if (!by) {
		res.status(400).send({ "Bad Request": "Missing required fields" });
	}
	try {
		if (by === "mostrecent") {
			const response = await prisma.post.findMany({
				include: {
					author: true,
					recipe: true,
					likedBy: true,
				},
				orderBy: {
					createdAt: "desc",
				},
			});
			res.status(200).json(response);
		} else if (by === "mostliked") {
			const response = await prisma.post.findMany({
				include: {
					author: true,
					recipe: true,
					likedBy: true,
				},
				orderBy: {
					likedBy: {
						_count: "desc",
					},
				},
			});
			res.status(200).json(response);
		}
	} catch (error: any) {
		res.status(500).send(error.message);
	}
}
