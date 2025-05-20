import { AsyncLocalStorage } from "async_hooks";
import { PrismaClient } from "@prisma/client";

export const DatabaseContext = new AsyncLocalStorage<PrismaClient>();

export function getDatabase() {
	const db = DatabaseContext.getStore();
	if (!db) throw new Error("Database context not found");
	return db;
}
