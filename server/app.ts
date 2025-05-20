import { createRequestHandler } from "@react-router/express";
import express from "express";
import { PrismaClient } from "@prisma/client";
import "react-router";

import { DatabaseContext } from "~/database/context";
import apiRouter from "./routes/route";

declare module "react-router" {
	interface AppLoadContext {
		VALUE_FROM_EXPRESS: string;
	}
}

export const app = express();

if (!process.env.DATABASE_URL) throw new Error("DATABASE_URL is required");

const prisma = new PrismaClient();
app.use((_, __, next) => DatabaseContext.run(prisma, next));

app.use(express.json());

app.use("/api", apiRouter);

app.use(
	createRequestHandler({
		build: () => import("virtual:react-router/server-build"),
		getLoadContext() {
			return {
				VALUE_FROM_EXPRESS: "Hello from Express",
			};
		},
	})
);
