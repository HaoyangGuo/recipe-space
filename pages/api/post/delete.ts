import type { NextApiRequest, NextApiResponse } from "next";
import { unstable_getServerSession } from "next-auth";
import { options } from "../auth/[...nextauth]";
import { prisma } from "../../../lib/prisma";
import { fetchJson } from "../../../lib/api";
import cloudinary from "cloudinary";

cloudinary.v2.config({
	cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
	api_key: process.env.CLOUDINARY_API_KEY,
	api_secret: process.env.CLOUDINARY_API_SECRET,
});

export default async function handler(
	req: NextApiRequest,
	res: NextApiResponse
) {
	switch (req.method) {
		case "DELETE":
			const { postId, imagePublicId } = req.body;
			const { id } = req.query;
			const session = await unstable_getServerSession(req, res, options);
			if (session && session.id === id) {
				try {
					await prisma.post.delete({
						where: {
							id: postId.toString(),
						},
					});

					await cloudinary.v2.uploader.destroy(imagePublicId);

					res.status(200).json({ Success: "Post deleted" });
				} catch (error: any) {
					console.log(error);
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
