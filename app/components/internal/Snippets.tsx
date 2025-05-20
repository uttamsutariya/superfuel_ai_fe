import { type Snippet } from "~/routes/home";
import { NavLink } from "react-router";
import CodeSnippet from "./CodeSnippet";

const Snippets = ({ snippets }: { snippets: Snippet[] }) => {
	return (
		<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
			{snippets.map((snippet) => (
				<NavLink to={`/snippets/${snippet.id}`} key={snippet.id}>
					<CodeSnippet code={snippet.code} title={snippet.title} isRunning={false} fromHome />
				</NavLink>
			))}
		</div>
	);
};

export default Snippets;
