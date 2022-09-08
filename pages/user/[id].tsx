import { useRouter } from "next/router";
import { useSession } from "next-auth/react";
import Image from "next/image";
import { User } from "../../types/types";
import { useQuery } from "@tanstack/react-query";
import { fetchJson } from "../../lib/api";
import SavedRecipe from "../../components/SavedRecipe";
import SavedPost from "../../components/SavedPost";

export const USER_QUERY_KEY = "user";

export const fetchUser = async (id: string) => {
	try {
		const user = await fetchJson(`/api/user?id=${id}`, {});
		return user;
	} catch (error) {
		throw error;
	}
};

const UserPage: React.FC = () => {
	const router = useRouter();
	const { id } = router.query;
	const { data: session, status } = useSession();

	const { isLoading, isError, data, error } = useQuery<User, Error>(
		[USER_QUERY_KEY],
		() => fetchUser(id as string),
		{
			enabled: status === "authenticated",
		}
	);

	if (status === "loading") {
		return (
			<div className="flex h-52 items-end justify-center mx-3">
				<div className="font-bold text-2xl">Loading...</div>
			</div>
		);
	}

	if (status === "unauthenticated" || !session || session!.id !== id) {
		return (
			<div className="flex h-52 items-end justify-center mx-3">
				<div className="font-bold text-2xl">Access Denied</div>
			</div>
		);
	}

	if (isLoading) {
		return (
			<div className="flex h-52 items-end justify-center mx-3">
				<div className="font-bold text-2xl">Loading...</div>
			</div>
		);
	}

	if (isError) {
		return (
			<div className="flex h-52 items-end justify-center mx-3">
				<div className="font-bold text-2xl">Error: {error.message}</div>
			</div>
		);
	}

	return (
		<div className="lg:mt-5 2xl:mt-10">
			<div className="bg-white rounded-lg shadow-md h-50 flex flex-col items-center justify-start">
				<div className="min-w-full pl-4 pt-1">
					<Image
						className="cursor-pointer"
						onClick={() => router.push({ pathname: "/search" })}
						src={"/icons/left-arrow.png"}
						alt="Back"
						width={30}
						height={40}
						layout="fixed"
					/>
				</div>
				<div className="flex flex-col items-center ">
					<Image
						className="rounded-full"
						src={session!.user!.image!}
						alt={session!.user!.name!}
						width={70}
						height={70}
						layout="fixed"
						priority
					/>
					<div className="text-2xl font-semibold">{session!.user!.name} </div>
				</div>
				<div className="rounded-b-lg bg-gray-100 min-w-full mt-5 grid grid-cols-1 lg:grid-cols-2 pt-2">
					<div className="p-2">
						<div className="font-semibold text-lg text-center">
							Saved Recipes
						</div>
						<div className="bg-white min-w-full h-72 rounded-lg mt-3 overflow-auto">
							{data!.savedRecipes!.map((recipe) => (
								<SavedRecipe key={recipe.id} {...recipe} />
							))}
						</div>
					</div>
					<div className="p-2 ">
						<div className="font-semibold text-lg text-center">Posts</div>
						<div className="overflow-hidden">
							<div className="bpx-content pr-5 bg-white min-w-full h-72 rounded-lg mt-3 overflow-auto">
								{data!.posts!.map((post, i) => (
									<SavedPost key={i} {...post} />
								))}
							</div>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
};

export default UserPage;
