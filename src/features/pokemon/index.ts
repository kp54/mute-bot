import { defineFeature } from "../../core/feature.js";
import type { ChannelCommandContext } from "../../core/types.js";
import { pokemonTypes, typeResistances } from "./constants.js";
import {
	combineResistances,
	prettyFormatResistance,
	randomType,
} from "./core.js";

const post = async (
	ctx: ChannelCommandContext,
	resistance: readonly number[],
	answer: readonly string[],
) => {
	const lines = [
		"** ポケモン耐性クイズ **",
		"耐性からタイプを推測してください",
		"",
		prettyFormatResistance(resistance),
		"",
		`正解: || ${answer.join("/")} ||`,
	];
	await ctx.reply(lines.join("\n"));
};

export default defineFeature(({ config }) => ({
	name: "pokemon",

	summary: `(${config.core.prefix}pt) ポケモン耐性クイズ`,

	matcher: new RegExp(`^${config.core.prefix}pt$`),

	onCommand: async (ctx) => {
		if (ctx.type !== "CHANNEL") {
			return;
		}

		const [type1, type2] = randomType();

		if (type2 === null) {
			const id = pokemonTypes.indexOf(type1);
			const resistance = typeResistances[id];
			await post(ctx, resistance, [type1]);
			return;
		}

		const resistance = combineResistances(type1, type2);
		await post(ctx, resistance, [type1, type2]);
	},
}));
