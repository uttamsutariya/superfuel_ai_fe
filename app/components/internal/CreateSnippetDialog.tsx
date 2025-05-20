import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
	DialogClose,
} from "~/components/ui/dialog";
import { Button } from "~/components/ui/button";
import { Textarea } from "~/components/ui/textarea";
import { useState } from "react";
import axios from "axios";
import { API_URL } from "~/constants";
import { Input } from "../ui/input";
import { toast } from "sonner";
import { useQueryClient } from "@tanstack/react-query";

const CreateSnippetDialog = () => {
	const queryClient = useQueryClient();
	const [code, setCode] = useState("");
	const [title, setTitle] = useState("");
	const [isLoading, setIsLoading] = useState(false);
	const handleSave = async () => {
		setIsLoading(true);
		try {
			if (!title || !code) {
				toast.error("Title and code are required");
				return;
			}
			await axios.post(`${API_URL}/snippets`, {
				code,
				title,
			});
			queryClient.invalidateQueries({ queryKey: ["snippets"] });
			toast.success("Snippet saved successfully");
			setCode("");
			setTitle("");
		} catch (error) {
			console.error(error);
			toast.error("Failed to save snippet");
		} finally {
			setIsLoading(false);
		}
	};

	return (
		<Dialog
			onOpenChange={(open) => {
				if (!open) {
					setCode("");
					setTitle("");
				}
			}}
		>
			<DialogTrigger>
				<Button>Create Snippet</Button>
			</DialogTrigger>
			<DialogContent>
				<DialogHeader>
					<DialogTitle>Save your snippet</DialogTitle>
					<DialogDescription>You can save your code and execute it later.</DialogDescription>
				</DialogHeader>
				<Input
					type="text"
					placeholder="Enter title"
					value={title}
					onChange={(e) => setTitle(e.target.value)}
					required
				/>
				<Textarea
					rows={50}
					className="max-h-[400px] min-h-[200px] overflow-y-auto"
					placeholder="Enter code here"
					value={code}
					onChange={(e) => setCode(e.target.value)}
					required
				/>
				<DialogFooter>
					<DialogClose asChild>
						<Button onClick={handleSave} disabled={isLoading}>
							{isLoading ? "Saving..." : "Save"}
						</Button>
					</DialogClose>
				</DialogFooter>
			</DialogContent>
		</Dialog>
	);
};

export default CreateSnippetDialog;
