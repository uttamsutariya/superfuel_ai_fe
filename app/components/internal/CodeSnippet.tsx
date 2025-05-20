import { Card, CardContent } from "~/components/ui/card";
import { Button } from "~/components/ui/button";
import { Loader2, Terminal } from "lucide-react";

const CodeSnippet = ({
	code,
	title = "",
	onRun,
	isRunning,
	fromHome = false,
}: {
	code: string;
	title: string;
	onRun?: () => Promise<void>;
	isRunning: boolean;
	fromHome?: boolean;
}) => {
	return (
		<Card
			className={`w-full py-0 overflow-hidden border border-gray-200 dark:border-gray-800 rounded-lg ${
				fromHome ? "h-[200px] overflow-y-auto" : ""
			}`}
		>
			{title && (
				<div className="flex items-center justify-between px-4 py-2 bg-gray-100 dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
					<div className="flex items-center gap-2">
						<span className="text-sm font-medium text-gray-700 dark:text-gray-300">{title}</span>
					</div>
					{!fromHome && (
						<Button
							variant="ghost"
							size="sm"
							className="h-8 px-2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
							onClick={onRun}
							disabled={isRunning}
						>
							{isRunning ? <Loader2 className="w-4 h-4 text-green-500" /> : <Terminal className="w-4 h-4" />}
							<span className="ml-2 text-xs">{isRunning ? "Running..." : "Run"}</span>
						</Button>
					)}
				</div>
			)}
			<CardContent className="p-0">
				<pre className={`p-4 text-sm overflow-x-auto bg-gray-50 dark:bg-gray-900 ${!title ? "rounded-lg" : ""}`}>
					<code className="font-mono text-gray-800 dark:text-gray-200 whitespace-pre">{code}</code>
				</pre>
			</CardContent>
		</Card>
	);
};

export default CodeSnippet;
