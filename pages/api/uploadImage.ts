import type { NextApiRequest, NextApiResponse } from "next";
import { unstable_getServerSession } from "next-auth";
import { options } from "./auth/[...nextauth]";
import cloudinary from "cloudinary";
import { IncomingForm } from "formidable";

export const config = {
	api: {
		bodyParser: false,
	},
};

cloudinary.v2.config({
	cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
	api_key: process.env.CLOUDINARY_API_KEY,
	api_secret: process.env.CLOUDINARY_API_SECRET,
});

export async function getImage(formData: any) {
	const data = await new Promise(function (resolve, reject) {
		const form = new IncomingForm({ keepExtensions: true });
		form.parse(formData, function (err, fields, files) {
			if (err) return reject(err);
			resolve({ fields, files });
		});
	});

	return data;
}

export default async function handler(
	req: NextApiRequest,
	res: NextApiResponse
) {
	const { id } = req.query;
	switch (req.method) {
		case "POST":
			const session = await unstable_getServerSession(req, res, options);
			if (session && session.id === id) {
				try {
					const data = await getImage(req) as any;
					const response = await cloudinary.v2.uploader.upload(
						data.files.file.filepath,
						{
							upload_preset: "recipe-space",
							eager_async: true,
						}
					);

					const url = response.secure_url;
					const publicId = response.public_id;

					res.status(200).json({ imageUrl: url, imagePublicId: publicId });
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
