import type { NextPage } from "next";
import Link from "next/link";
import Head from "next/head";
import Image from "next/image";

const Home: NextPage = () => {
	return (
		<div className="lg:mt-5 2xl:mt-10">
			<div className="flex flex-col items-center pt-10 sm:pt-14 pb-14 gap-5">
				<div className="w-10/12 text-2xl sm:text-3xl text-center">
					Discover Thousands of Recipes on the Internet Based on
					Ingredients You Have!
				</div>
				<Link href="/search">
					<button className="px-5 py-2 rounded-md bg-green-600 font-semibold text-xl hover:bg-green-700 text-white">
						start cooking!
					</button>
				</Link>
				<div className="w-full">
					<Image
						src="/image/recipes-screenshot.png"
						alt="recipes"
						width={1000}
						height={600}
						layout="responsive"
					/>
				</div>
				<div className="w-10/12 text-2xl sm:text-3xl text-center">
					Join our community and share what you made!
				</div>
				<div className="w-full">
					<Image
						src="/image/feed-screenshot.png"
						alt="feed"
						width={1000}
						height={625}
						layout="responsive"
					/>
				</div>
			</div>
		</div>
	);
};

export default Home;
