import type { NextApiRequest, NextApiResponse } from "next";
import { unstable_getServerSession } from "next-auth";
import { options } from "./auth/[...nextauth]";
import { Post } from "../../types/types";
import { prisma } from "../../lib/prisma";

export default async function handler(
	req: NextApiRequest,
	res: NextApiResponse
) {
	switch (req.method) {
		case "POST":
			const { recipe, title, imageUrl, content } = req.body;
			const { id, imagePublicId } = req.query;
			const session = await unstable_getServerSession(req, res, options);
			if (!recipe || !title || !imageUrl || !content || !id || !imagePublicId) {
				res.status(400).send({ "Bad Request": "Missing required fields" });
				return;
			}
			if (session && session.id === id) {
				try {
					await prisma.post.create({
						data: {
							title: title,
							imageUrl: imageUrl,
							imagePublicId: imagePublicId.toString(),
							content: content,
							author: {
								connect: {
									id: id as string,
								},
							},
							recipe: {
								connect: {
									id: recipe,
								},
							},
						},
					});
					res.status(200).json({ Success: "Post created" });
				} catch (error: any) {
					console.log(error);
					res.status(500).send(error.message);
				}
			} else {
				res.status(401).send({ Unauthorized: "You are not logged in" });
			}
			break;
		default:
			res.status(405).send({ "Method Not Allowed": "Use POST" });
	}
}
