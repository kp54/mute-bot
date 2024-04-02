import type { Logger } from "./types.js";

export const createConsoleLogger = (): Logger => ({
	log: (...values) => console.log(values.join("\n")),
	error: (...values) => console.error(values.join("\n")),
});
