import { defineFeature } from "../../core/feature.js";

export default defineFeature(({ config }) => ({
	name: "ping",

	matcher: new RegExp(`^${config.core.prefix}ping$`),

	onCommand: async (ctx) => {
		if (ctx.type === "CHANNEL") {
			await ctx.reply("pong!");
		}
	},
}));
