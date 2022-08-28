import { Recipe } from "../types/types";
import Image from "next/image";
import { useRouter } from "next/router";

const QueryRecipeButton = ({ recipe }: { recipe: Recipe }) => {
	const router = useRouter();

	function handleRecipeClick() {
		router.push({
			pathname: `/recipe/${recipe.id}`,
		});
	}

	return (
		<div
			onClick={handleRecipeClick}
			className="bg-white p-3 rounded-md shadow-md flex flex-col cursor-pointer hover:bg-gray-100 items-center justify-center w-30 gap-2"
		>
			<Image
				src={recipe.image}
				alt={recipe.title}
				width={120}
				height={100}
				layout="fixed"
			/>
			<div className="font-semibold text-center">{recipe.title}</div>
		</div>
	);
};

export default QueryRecipeButton;
