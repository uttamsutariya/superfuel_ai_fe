import { useParams, useLoaderData, Link } from "react-router";
import { API_URL } from "~/constants";
import type { Route } from "./+types/snippet";
import type { Snippet } from "./home";
import axios from "axios";
import { ResizableHandle, ResizablePanel, ResizablePanelGroup } from "~/components/ui/resizable";
import CodeSnippet from "~/components/internal/CodeSnippet";
import { useState } from "react";

export async function loader({ params }: Route.LoaderArgs) {
	const { snippetId } = params;
	const snippetResponse = await axios.get<Snippet>(`${API_URL}/snippets/${snippetId}`);
	return { snippet: snippetResponse.data };
}

type ExecutionResult = {
	success: boolean;
	output: string[];
	stdout: string;
	stderr: string;
	error?: string;
};

export default function Snippet() {
	const { snippetId } = useParams();
	const { snippet } = useLoaderData<typeof loader>();
	const [executionResult, setExecutionResult] = useState<ExecutionResult | null>(null);
	const [isRunning, setIsRunning] = useState(false);

	const runSnippet = async () => {
		try {
			setIsRunning(true);
			const response = await axios.post<ExecutionResult>(`${API_URL}/snippets/${snippetId}/run`);
			setExecutionResult(response.data);
		} catch (error) {
			if (axios.isAxiosError(error)) {
				setExecutionResult({
					success: false,
					output: [],
					stdout: "",
					stderr: "",
					error: error.response?.data?.error || "Failed to run snippet",
				});
			}
		} finally {
			setIsRunning(false);
		}
	};

	return (
		<div>
			<ResizablePanelGroup direction="horizontal" className="w-full border">
				<ResizablePanel defaultSize={40}>
					<div className="min-h-[100vh] p-6">
						<div>
							<p className="text-sm text-gray-500">Created {new Date(snippet.createdAt).toLocaleDateString()}</p>
						</div>
						<div className="mt-6">
							<CodeSnippet code={snippet.code} title={snippet.title} onRun={runSnippet} isRunning={isRunning} />
						</div>
					</div>
				</ResizablePanel>
				<ResizableHandle className="w-1" />
				<ResizablePanel defaultSize={60}>
					<div className="flex flex-col min-h-[100vh] p-6">
						<div className="flex items-center justify-between mb-6">
							<p className="font-semibold text-2xl">Executions</p>
						</div>

						{executionResult && (
							<div className="flex-1 bg-gray-50 rounded-lg p-4 overflow-auto">
								{executionResult.success ? (
									<div className="space-y-4">
										{executionResult.output.length > 0 && (
											<div>
												<h3 className="text-sm font-medium text-gray-700 mb-2">Output:</h3>
												<div className="bg-white rounded p-3 font-mono text-sm">
													{executionResult.output.map((line, index) => (
														<div key={index} className="whitespace-pre-wrap">
															{line}
														</div>
													))}
												</div>
											</div>
										)}
										{executionResult.stderr && (
											<div>
												<h3 className="text-sm font-medium text-gray-700 mb-2">Warnings:</h3>
												<div className="bg-yellow-50 text-yellow-800 rounded p-3 font-mono text-sm">
													{executionResult.stderr}
												</div>
											</div>
										)}
									</div>
								) : (
									<div className="bg-red-50 text-red-800 rounded p-4">
										<h3 className="font-medium mb-2">Error:</h3>
										<p className="font-mono text-sm">{executionResult.error || executionResult.stderr}</p>
									</div>
								)}
							</div>
						)}
					</div>
				</ResizablePanel>
			</ResizablePanelGroup>
		</div>
	);
}

export async function ErrorBoundary() {
	return (
		<div className="flex min-h-[100vh] items-center justify-center">
			<div>
				<p className="text-2xl font-semibold">Error</p>
				<p className="text-sm text-gray-500">Something went wrong</p>
				<Link to="/" className="text-xs underline">
					Go back to home
				</Link>
			</div>
		</div>
	);
}
