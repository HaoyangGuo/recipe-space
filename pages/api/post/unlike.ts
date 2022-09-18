import type { NextApiRequest, NextApiResponse } from "next";
import { unstable_getServerSession } from "next-auth";
import { options } from "../auth/[...nextauth]";
import { prisma } from "../../../lib/prisma";

export default async function handler(
	req: NextApiRequest,
	res: NextApiResponse
) {
	switch (req.method) {
		case "POST":
			const { postId, userId } = req.query;
			const session = await unstable_getServerSession(req, res, options);
			if (!postId || !userId) {
				res.status(400).send({ "Bad Request": "Missing required fields" });
				return;
			}
			if (session && session.id === userId) {
				try {
					await prisma.post.update({
						where: {
							id: postId.toString(),
						},
						data: {
							likedBy: {
								disconnect: {
									id: userId.toString(),
								},
							},
						},
					});
					res.status(200).json({ Success: "Post Unliked" });
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
