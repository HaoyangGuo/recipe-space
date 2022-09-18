/** @type {import('next').NextConfig} */
const nextConfig = {
	reactStrictMode: true,
	swcMinify: true,
	images: {
		domains: ["spoonacular.com", "lh3.googleusercontent.com", "res.cloudinary.com"],
	},
};

module.exports = nextConfig;
