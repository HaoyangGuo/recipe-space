import { NextApiHandler } from "next";
import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import { PrismaAdapter } from "@next-auth/prisma-adapter";
import Adapters from "next-auth/adapters";
import { prisma } from "../../../lib/prisma";

export const options = {
	adapter: PrismaAdapter(prisma),
	providers: [
		GoogleProvider({
			clientId: process.env.GOOGLE_CLIENT_ID!,
			clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
		}),
	],
	secret: process.env.JWT_SECRET!,
	callbacks: {
		//@ts-ignore
		async session({ session, user, token }) {
			session.id = user.id;
			return session;
		},
	},
};

const authHandler: NextApiHandler = async (req, res) =>
	NextAuth(req, res, options);

export default authHandler;
