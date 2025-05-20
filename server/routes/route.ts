import express, { type RequestHandler, type Request, type Response } from "express";
import { PrismaClient } from "@prisma/client";
import { exec } from "child_process";
import { promises as fs } from "fs";
import path from "path";
import crypto from "crypto";

const __dirname = path.resolve();

const prisma = new PrismaClient();

const apiRouter = express.Router();
apiRouter.use(express.json());

apiRouter.get("/", (req: Request, res: Response) => {
	res.json({ message: "Hello from Express" });
});

apiRouter.get("/snippets", async (req: Request, res: Response) => {
	try {
		const snippets = await prisma.snippet.findMany({
			orderBy: {
				createdAt: "desc",
			},
		});

		res.status(200).json(snippets);
	} catch (error) {
		res.status(500).json({ error: "Failed to fetch snippets" });
	}
});

apiRouter.get("/snippets/:snippetId", (async (req: Request, res: Response) => {
	try {
		const { snippetId } = req.params;

		if (!snippetId) {
			return res.status(400).json({ error: "Snippet ID is required" });
		}

		const snippet = await prisma.snippet.findUnique({
			where: { id: snippetId },
		});

		res.status(200).json(snippet);
	} catch (error) {
		res.status(404).json({ error: "Snippet not found" });
	}
}) as unknown as RequestHandler);

apiRouter.post("/snippets", async (req: Request, res: Response) => {
	try {
		const { title, code } = req.body as { title: string; code: string };

		const snippet = await prisma.snippet.create({
			data: { title, code },
		});

		res.status(201).json(snippet);
	} catch (error) {
		res.status(500).json({ error: "Failed to create snippet" });
	}
});

apiRouter.post("/snippets/:snippetId/run", (async (req: Request, res: Response) => {
	try {
		const { snippetId } = req.params;

		if (!snippetId) {
			return res.status(400).json({ error: "Snippet ID is required" });
		}

		const snippet = await prisma.snippet.findUnique({
			where: { id: snippetId },
		});

		if (!snippet) {
			return res.status(404).json({ error: "Snippet not found" });
		}

		// Create a temporary file with the code
		const tempId = crypto.randomBytes(16).toString("hex");
		const tempFilePath = path.join(__dirname, "temp", `${tempId}.js`);

		// Prepare the code by adding console.log wrapper
		const executableCode = `
			// Wrap console.log to capture output
			const originalConsoleLog = console.log;
			const outputs = [];
			console.log = (...args) => {
				outputs.push(args.join(" "));
				originalConsoleLog.apply(console, args);
			};

			// Main code from database
			${snippet.code}

			// Return the outputs
			console.log(JSON.stringify(outputs));
		`;

		// Create temp directory if it doesn't exist
		await fs.mkdir(path.join(__dirname, "temp"), { recursive: true });
		await fs.writeFile(tempFilePath, executableCode);

		// Execute the code in a separate process
		exec(`node ${tempFilePath}`, { timeout: 5000 }, async (error, stdout, stderr) => {
			// Clean up - delete the temp file
			try {
				await fs.unlink(tempFilePath);
			} catch (cleanupError) {
				console.error("Error cleaning up temp file:", cleanupError);
			}

			if (error) {
				return res.status(500).json({
					success: false,
					error: error.message,
					stderr,
				});
			}

			// Parse the outputs from the last line
			let outputs = [];
			try {
				const lines = stdout.trim().split("\n");
				const lastLine = lines[lines.length - 1];
				outputs = JSON.parse(lastLine);
			} catch (parseError) {
				console.error("Error parsing outputs:", parseError);
			}

			res.status(200).json({
				success: true,
				output: outputs,
				stdout,
				stderr,
			});
		});
	} catch (error) {
		console.error("Error running snippet:", error);
		res.status(500).json({ error: "Failed to run snippet" });
	}
}) as unknown as RequestHandler);

export default apiRouter;
