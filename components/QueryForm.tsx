import { getEnumKeys } from "../utils/form";
import { atom, useAtom } from "jotai";
import { useForm } from "react-hook-form";
import { useRouter } from "next/router";
import Image from "next/image";

enum Cuisine {
	All = "All",
	African = "African",
	American = "American",
	British = "British",
	Cajun = "Cajun",
	Caribbean = "Caribbean",
	Chinese = "Chinese",
	EasternEuropean = "Eastern European",
	European = "European",
	French = "French",
	German = "German",
	Greek = "Greek",
	Indian = "Indian",
	Irish = "Irish",
	Italian = "Italian",
	Japanese = "Japanese",
	Jewish = "Jewish",
	Korean = "Korean",
	LatinAmerican = "Latin American",
	Mediterranean = "Mediterranean",
	Mexican = "Mexican",
	MiddleEastern = "Middle Eastern",
	Nordic = "Nordic",
	Southern = "Southern",
	Spanish = "Spanish",
	Thai = "Thai",
	Vietnamese = "Vietnamese",
}

enum Diet {
	All = "All",
	Vegetarian = "Vegetarian",
	Vegan = "Vegan",
	GlutonFree = "Gluton Free",
}

export interface RecipeQuery {
	name: string;
	cuisine: Cuisine;
	diet: Diet;
}

export const QueryAtom = atom<RecipeQuery>({
	name: "",
	cuisine: Cuisine.All,
	diet: Diet.All,
});

const QueryForm: React.FC = () => {
	const [query, updateQuery] = useAtom(QueryAtom);
	const router = useRouter();

	const {
		register,
		handleSubmit,
		formState: { errors },
	} = useForm<RecipeQuery>();

	const onSubmit = (data: RecipeQuery) => {
		updateQuery(data);
		router.push({
			pathname: "/query-result",
		});
	};

	return (
		<div className="flex flex-col gap-3 md:w-96 shrink-0">
			<div className="container p-3 bg-white rounded-md shadow-md">
				Have a dish you want to make but don&apos;t know how to make it? Recipe
				Space will give you a{" "}
				<span className="font-bold">list of perfected recipes</span> so you can
				use whichever one you like.
			</div>
			<div className="container p-3 bg-blue-200">
				<div className="inline">
					If you don&apos;t know what to make yet, try search for recipes by
					ingredients instead{""}
				</div>
				<Image
					className="mx-6 rotate-90 lg:rotate-0"
					alt="pointer-left"
					src="/icons/pointer-left.png"
					height={25}
					width={25}
				/>
			</div>
			<div className="py-5 bg-white rounded-md shadow-md px-10 md:px-5">
				<div className="flex items-center pb-4 ">
					<div className="text-lg font-semibold mr-2">Search by name</div>
					<Image src="/icons/search.png" alt="search" height={25} width={25} />
				</div>
				<form onSubmit={handleSubmit(onSubmit)} className="flex flex-col">
					<label className="mb-5">
						Name:
						<input
							{...register("name")}
							className="mx-4 p-1 bg-gray-200 rounded shadow-sm text-center"
						/>
					</label>
					<label className="mb-5">
						Cuisine:
						<select
							{...register("cuisine", { required: true })}
							className="mx-4 p-1 bg-gray-200 rounded shadow-sm text-center"
						>
							{getEnumKeys(Cuisine).map((key, i) => (
								<option key={i} value={Cuisine[key]}>
									{Cuisine[key]}
								</option>
							))}
						</select>
					</label>
					<label className="mb-1">
						Diet:
						<select
							{...register("diet", { required: true })}
							className="mx-4 p-1 bg-gray-200 rounded shadow-sm text-center"
						>
							{getEnumKeys(Diet).map((key, i) => (
								<option key={i} value={Diet[key]}>
									{Diet[key]}
								</option>
							))}
						</select>
					</label>
					{errors.name && (
						<div className="text-red-700">*please enter a name!</div>
					)}
					<button
						className="cursor-pointer py-1 mt-4 px-6 text-md font-semibold w-min self-center border rounded-full bg-gray-200 hover:bg-gray-400"
						type="submit"
					>
						Search
					</button>
				</form>
			</div>
		</div>
	);
};

export default QueryForm;
