import axios from "axios";
import { API_URL } from "~/constants";
import Snippets from "~/components/internal/Snippets";
import CreateSnippetDialog from "~/components/internal/CreateSnippetDialog";
import { useQuery } from "@tanstack/react-query";

export function meta() {
	return [{ title: "JS Snippets" }, { name: "description", content: "Create and save javascript snippets" }];
}

export type Snippet = {
	id: string;
	title: string;
	code: string;
	createdAt: string;
	updatedAt: string;
};

export default function Home() {
	const { data: snippets } = useQuery({
		queryKey: ["snippets"],
		queryFn: async () => {
			const response = await axios.get<Snippet[]>(`${API_URL}/snippets`);
			return response.data;
		},
	});

	return (
		<>
			<div className="flex justify-between items-end gap-4 max-w-[1200px] mx-auto pt-4">
				<div>
					<p className="text-2xl font-bold">JS Snippets</p>
					<div className="flex flex-col gap-2">
						<p className="text-sm text-gray-500">Create a javascript snippet, save it & execute it.</p>
					</div>
				</div>
				<div>
					<CreateSnippetDialog />
				</div>
			</div>
			<div className="flex flex-col gap-4 max-w-[1200px] mx-auto pt-4">
				{snippets && snippets.length > 0 ? (
					<Snippets snippets={snippets} />
				) : (
					<div className="flex flex-col gap-2">
						<p className="text-sm text-gray-500">No snippets found</p>
					</div>
				)}
			</div>
		</>
	);
}
