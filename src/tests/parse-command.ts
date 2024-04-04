import { parseCommand } from "../core/client/parse-command.js";
import { assertEqual } from "./assertion.js";

const cases: [string, readonly string[]][] = [
	["a s d f", ["a", "s", "d", "f"]],
	[`a ' s ' d`, ["a", " s ", "d"]],
	[`'a " s ' d`, ['a " s ', "d"]],
	[`' a '  s  d`, [" a ", "s", "d"]],
	[`' a '  s  d`, [" a ", "s", "d"]],
	[" ", []],
	[`' '`, [" "]],
	[`''`, [""]],
	[`'  '  "  "  '  '`, ["  ", "  ", "  "]],
	[`who's who`, [`who's`, "who"]],
];

export const testParseCommand = () => {
	console.log("testing for parseCommand:");

	for (const [input, expected] of cases) {
		const actual = parseCommand(input);
		assertEqual(input, actual, expected);
	}
};
