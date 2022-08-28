export interface Recipe {
	id: number;
	title: string;
	image: string;
	usedIngredients?: Ingredient[];
	missedIngredients?: Ingredient[];
	sourceUrl?: string;
}

export interface Ingredient {
	id: number;
	name: string;
}

export interface User {
	id: string;
	name: string | null;
	savedRecipes?: Recipe[];
}
