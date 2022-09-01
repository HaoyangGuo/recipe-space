import type { NextApiRequest, NextApiResponse } from "next";
import { unstable_getServerSession } from "next-auth";
import { options } from "./auth/[...nextauth]";
import { fetchJson } from "../../lib/api";
import axios from "axios";
import cloudinary from "cloudinary";
// import formidable, { IncomingForm } from "formidable-serverless";
import { IncomingForm } from "formidable";

export const config = {
	api: {
		bodyParser: false,
	},
};

cloudinary.v2.config({
	cloud_name: "djmi1dhtm",
	api_key: "333248695731175",
	api_secret: "6_mXkhf72A7HeEjsVycBo9ezUrY",
});

export async function getImage(formData) {
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
					const data = await getImage(req);

					// console.log(data);
					// console.log(data.files.file.filepath);

					const response = await cloudinary.v2.uploader.upload(data.files.file.filepath, {
						upload_preset: "recipe-space",
					});

					const url = response.secure_url;

					res.status(200).json(url as string);
				} catch (error: any) {
					console.log(error);
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
