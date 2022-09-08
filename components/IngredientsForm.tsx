import { atom, useAtom } from "jotai";
import { useForm, useFieldArray } from "react-hook-form";
import { useRouter } from "next/router";
import Image from "next/image";

interface ingredient {
	ingredientName: string;
}

interface FormValues {
	ingredients: ingredient[];
}

export const ingredientsListAtom = atom<string[]>([]);

const IngredientsForm: React.FC = () => {
	const router = useRouter();
	const [ingredients, updateIngredientList] = useAtom(ingredientsListAtom);

	const {
		register,
		control,
		handleSubmit,
		formState: { errors },
	} = useForm<FormValues>({
		defaultValues: {
			ingredients: [{ ingredientName: "onion" }],
		},
		mode: "onBlur",
	});

	const { fields, append, remove } = useFieldArray({
		name: "ingredients",
		control,
	});

	const onSubmit = (data: FormValues) => {
		if (data.ingredients.length > 0) {
			updateIngredientList(data.ingredients.map((ingredient) => ingredient.ingredientName));
			router.push({
				pathname: "/ingredients-result",
			});
		}
	};

	return (
		<div className="flex flex-col gap-3">
			<div className="container p-3 bg-white rounded-md shadow-md">
				Recipe space allows you to conveniently search through refined recipes
				on the Internet and shows you ones that{" "}
				<span className="font-bold">use ingredients you already have!</span>
			</div>
			<div className="container p-3 bg-green-200">
				<div className="inline">
					If you have already decided what you&apos;re going to make, try search
					for recipes by name instead{""}
				</div>
				<Image
					className="mx-6 rotate-90 lg:rotate-0"
					alt="pointer-right"
					src="/icons/pointer-right.png"
					height={25}
					width={25}
				/>
			</div>
			<div className="container grow-0 shrink-0 min-w-max p-5 bg-white rounded-md shadow-md">
				<div className="flex items-center pb-4">
					<div className="text-lg font-semibold mr-2">
						Search by ingredients
					</div>
					<Image src="/icons/tomato.png" alt="search" height={25} width={25} />
				</div>
				<form onSubmit={handleSubmit(onSubmit)} className="flex flex-col">
					{fields.map((field, index) => {
						return (
							<div key={field.id} className="pb-3">
								<div className="flex items-center justify-between">
									<label>
										{`Ingredient ${index + 1}.`}
										<input
											className="mx-4 p-1 bg-gray-200 rounded shadow-sm text-center"
											{...register(
												`ingredients.${index}.ingredientName` as const,
												{ required: true }
											)}
										/>
									</label>
									{fields.length >= 2 && (
										<button
											className="cursor-pointer"
											type="button"
											onClick={() => remove(index)}
										>
											<Image
												height={25}
												width={25}
												src="/icons/delete.png"
												alt="delete"
											/>
										</button>
									)}
								</div>
							</div>
						);
					})}
					{fields.length < 8 && (
						<button
							className="bg-green-500 hover:bg-green-700 text-white font-bold mt-3 py-1 px-2 rounded flex items-center justify-center"
							type="button"
							onClick={() => append({ ingredientName: "" })}
						>
							<div className="pr-2">add ingredient</div>
							<Image height={20} width={20} src="/icons/onion.png" alt="add" />
						</button>
					)}
					{errors.ingredients?.length !== 1 && errors.ingredients && (
						<div className="text-red-700">
							*please remove empty ingredient(s)!
						</div>
					)}
					<button
						className="cursor-pointer py-1 px-6 mt-4 text-md font-semibold w-min self-center border rounded-full bg-gray-200 hover:bg-gray-400"
						type="submit"
					>
						Search
					</button>
				</form>
			</div>
			<style jsx>{`
				.container {
					width: 22rem;
				}

				@media (min-width: 380px) {
					.container {
						width: 25rem;
					}
				}

				@media (min-width: 2570px) {
					.container {
						width: 28rem;
					}
				}
			`}</style>
		</div>
	);
};

export default IngredientsForm;
