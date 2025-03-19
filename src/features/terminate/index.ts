import { defineFeature } from "../../core/feature.js";

export const terminate = defineFeature(({ config }) => ({
	name: "terminate",
	usage: `${config.core.prefix}terminate`,
	summary: "緊急停止",

	matcher: new RegExp(`^${config.core.prefix}terminate$`),

	onCommand: async (ctx) => {
		setImmediate(() => {
			throw new Error("terminated by feature/terminate");
		});
	},
}));
