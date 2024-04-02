import { defineFeature } from "../../core/feature.js";

export const ping = defineFeature({
	id: "76db02a1-d8dc-4586-b72c-b89d33eb4153",
	name: "ping",
	create: ({ config }) => ({
		usage: null,
		summary: null,
		matcher: new RegExp(`^${config.core.prefix}ping$`),
		onCommand: async (ctx) => {
			if (ctx.type === "CHANNEL") {
				await ctx.reply("pong!");
			}
		},
	}),
});
