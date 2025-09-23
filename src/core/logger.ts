import type { Logger } from "./types.ts";

export const createConsoleLogger = (): Logger => ({
	log: (...values) => console.log(values.join("\n")),
	error: (...values) => console.error(values.join("\n")),
});
