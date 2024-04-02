import { defineFeature } from "../../core/feature.js";
import { evaluate } from "./core.js";

const usage = `
\`\`\`
演算

+ add
  二項演算子 \`x + y\` をスタックに追加

- sub
  二項演算子 \`x - y\` をスタックに追加

* mul
  二項演算子 \`x * y\` をスタックに追加

/ div
  二項演算子 \`x / y\` をスタックに追加

% divmod
  二項演算子 \`x // y\`, \`x % y\` をスタックに追加

^ pow
  二項演算子 \`x ^ y\` をスタックに追加

~ log
  二項演算子 \`log_y(x)\` をスタックに追加

_ drop
  単項演算子 なにもしない

. dup
  単項演算子 \`x\`, \`x\` をスタックに追加

< rol
  コマンド スタックを左ローテート

> ror
  コマンド スタックを右ローテート

= print
  コマンド スタックトップを出力バッファに転送

$ stack
  コマンド スタックを出力バッファに転送
\`\`\`
`.slice(1, -1);

export default defineFeature(({ config }) => ({
	name: "rpn",

	summary: "スタックベースの計算器",

	usage,

	matcher: new RegExp(`${config.core.prefix}rpn`),

	onCommand: async (ctx, command) => {
		const result = evaluate(command.args);

		switch (result[0]) {
			case "Ok": {
				const [_type, lines] = result;
				await ctx.post(`OK:\n${lines}`);

				return;
			}

			case "Bottom": {
				const [_type, index, lines] = result;
				await ctx.post(`ERR: ${index}: Insufficient stack.\n${lines}`);

				return;
			}

			case "NaN": {
				const [_type, index, lines] = result;
				await ctx.post(`ERR: ${index}: Encountered NaN.\n${lines}`);

				return;
			}

			case "Infinity": {
				const [_type, index, lines] = result;
				await ctx.post(`ERR: ${index}: Encountered Infinity.\n${lines}`);

				return;
			}

			case "Empty": {
				await ctx.post(usage);

				return;
			}

			default:
				throw new Error();
		}
	},
}));
