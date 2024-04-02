export const parseCommand = (line: string): ReadonlyArray<string> => {
	let withinQuote: "SINGLE" | "DOUBLE" | "NONE" = "NONE";
	let hasLeadingBackslash = false;
	let isInterWord = true;

	const result: string[] = [];
	const buffer: string[] = [];

	const whitespaces = /\s/;

	for (const char of [...line, "\n"]) {
		if (whitespaces.test(char)) {
			if (isInterWord) {
				continue;
			}

			if (withinQuote === "NONE") {
				const part = buffer.join("");
				buffer.splice(0);
				isInterWord = true;
				result.push(part);
				continue;
			}
		}

		isInterWord = false;

		if (hasLeadingBackslash) {
			buffer.push(char);
			hasLeadingBackslash = false;
			continue;
		}

		if (char === `'`) {
			switch (withinQuote) {
				case "NONE":
					withinQuote = "SINGLE";
					continue;

				case "SINGLE":
					withinQuote = "NONE";
					continue;

				case "DOUBLE":
					buffer.push(`'`);
					continue;

				default:
					throw new Error();
			}
		}

		if (char === `"`) {
			switch (withinQuote) {
				case "NONE":
					withinQuote = "DOUBLE";
					continue;

				case "SINGLE":
					buffer.push(`"`);
					continue;

				case "DOUBLE":
					withinQuote = "NONE";
					continue;

				default:
					throw new Error();
			}
		}

		if (char === "\\") {
			hasLeadingBackslash = true;
			continue;
		}

		buffer.push(char);
	}

	if (withinQuote !== "NONE" || hasLeadingBackslash) {
		// fallback to simple split
		return line.split(whitespaces);
	}

	return result;
};

export default { parseCommand };
