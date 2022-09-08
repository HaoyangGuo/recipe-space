import type { NextApiRequest, NextApiResponse } from "next";
import { prisma } from "../../lib/prisma";

export default async function handler(
	req: NextApiRequest,
	res: NextApiResponse
) {
	try {
    const response = await prisma.post.findMany({

    })
		res.status(200).json(response);
	} catch (error: any) {
		res.status(500).send(error.message);
	}
}
