import { Recipe, Ingredient } from "../types/types";
import { useRouter } from "next/router";
import Image from "next/image";

const IngredientsRecipeButton = ({ recipe }: { recipe: Recipe }) => {
	const router = useRouter();

	function handleRecipeClick() {
		router.push({
			pathname: `/recipe/${recipe.id}`,
		});
	}

	return (
		<div
			className="bg-white p-3 min-w-full rounded-md shadow-md flex flex-col cursor-pointer hover:bg-gray-100"
			onClick={handleRecipeClick}
		>
			<div className="flex gap-3">
				<div className="shrink-0">
					<Image
						src={recipe.image}
						alt={recipe.title}
						width={120}
						height={100}
						layout="fixed"
					/>
				</div>
				<div className="flex flex-col gap-1">
					<div className="font-semibold">{recipe.title}</div>
					<span className="flex flex-wrap text-sm items-center gap-1">
						<div>Used ingredients: </div>
						{recipe.usedIngredients &&
							recipe.usedIngredients.map(
								(ingredient: Ingredient, i: number) => (
									<div
										key={i}
										className="text-sm font-semibold bg-green-200 px-2 py-1 rounded-md"
									>
										{ingredient.name}
									</div>
								)
							)}
					</span>

					<span className="flex flex-wrap text-sm items-center gap-1">
						<div>Missing ingredients: </div>
						{recipe.missedIngredients &&
							recipe.missedIngredients.map(
								(ingredient: Ingredient, i: number) => (
									<div
										className="text-sm font-semibold bg-red-200 px-2 py-1 rounded-md"
										key={i}
									>
										{ingredient.name}
									</div>
								)
							)}
					</span>
				</div>
			</div>
		</div>
	);
};

export default IngredientsRecipeButton;
