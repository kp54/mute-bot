import type { Feature, FeatureFactory, SetupContext } from "./types.js";

type FeatureDefinition = {
	name: string;
	summary?: string;
	usage?: string;
	matcher: RegExp;
	onCommand?: Feature["onCommand"];
};

const noop = () => Promise.resolve();

export const defineFeature =
	(definition: (ctx: SetupContext) => FeatureDefinition): FeatureFactory =>
	(ctx: SetupContext): Feature => {
		const instance = definition(ctx);

		return {
			name: instance.name,
			summary: instance.summary ?? "不明なモジュール",
			usage: instance.usage ?? null,
			matcher: instance.matcher,
			onCommand: instance.onCommand ?? noop,
		};
	};
