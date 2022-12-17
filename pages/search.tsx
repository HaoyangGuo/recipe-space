
import IngredientsForm from "../components/IngredientsForm";
import QueryForm from "../components/QueryForm";


function SearchPage() {

	return (
		<div className="flex flex-col items-center gap-5 lg:mt-5 2xl:mt-10 lg:flex-row lg:justify-between lg:items-start max-w-fit mx-auto">
			<IngredientsForm />
			<QueryForm />
		</div>
	);
}

export default SearchPage;
