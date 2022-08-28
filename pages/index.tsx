import type { NextPage } from "next";
import Link from "next/link";
import Head from "next/head";
import Image from "next/image";

const Home: NextPage = () => {
	return (
		<div className="border lg:mt-5 2xl:mt-10">
			<div>Welcome</div>
			<Link href="/search">
				<button className="p-2 rounded-md bg-white text-gray-600 ">
					start cooking!
				</button>
			</Link>
		</div>
	);
};

export default Home;
