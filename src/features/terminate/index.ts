import process from "node:process";
import { defineFeature } from "../../core/feature.js";

export const terminate = defineFeature(({ config }) => ({
	name: "terminate",
	usage: `${config.core.prefix}terminate`,
	summary: "緊急停止",

	matcher: new RegExp(`^${config.core.prefix}terminate$`),

	onCommand: async (ctx) => {
		await ctx.post("termiating mute-bot");
		process.exit(1);
	},
}));
