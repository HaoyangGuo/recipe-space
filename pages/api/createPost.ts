import type { NextApiRequest, NextApiResponse } from "next";
import { unstable_getServerSession } from "next-auth";
import { options } from "./auth/[...nextauth]";
import { Post } from "../../types/types";
import prisma from "../../lib/prisma";

export default async function handler(
	req: NextApiRequest,
	res: NextApiResponse
) {
	switch (req.method) {
		case "POST":
			const { title, content, image } = req.body;
			const { id } = req.query;
			const session = await unstable_getServerSession(req, res, options);
			if (session && session.id === id) {
        try {
          





					res.status(200).json({});
				} catch (error: any) {
					res.status(500).send(error.message);
				}
			} else {
				res.status(401).end();
			}
			break;
		default:
			res.status(405).end();
	}
}
