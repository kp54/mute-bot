import type { Message } from "discord.js";
import type { Config, Feature } from "../../types.js";

export const handleHelp = async (
	config: Config,
	features: readonly Feature[],
	argv: readonly string[],
	message: Message<boolean>,
): Promise<boolean> => {
	const usage = async () => {
		const lines = [
			"```",
			...features.map((x) => `${x.name} : ${x.summary ?? "不明なモジュール"}`),
			"```",
		].join("\n");

		await message.reply(lines);
	};

	if (argv[0] !== `${config.core.prefix}help`) {
		return false;
	}

	if (argv.length === 1) {
		await usage();
		return true;
	}

	const name = argv[1];
	const feat = features.find((x) => x.name === name);
	if (feat === undefined) {
		await usage();
		return true;
	}

	if (feat.usage === null) {
		await message.reply("ヘルプは利用できません");
		return true;
	}

	await message.reply(feat.usage);
	return true;
};
