export const parseCommand = (line: string): ReadonlyArray<string> => {
	let withinQuote: "SINGLE" | "DOUBLE" | "NONE" = "NONE";
	let hasLeadingBackslash = false;
	let isInterWord = true;

	const result: string[] = [];
	const buffer: string[] = [];

	const whitespaces = /\s/;

	[...line, "\n"].forEach((char) => {
		if (whitespaces.test(char)) {
			if (isInterWord) {
				return;
			}

			if (withinQuote === "NONE") {
				const part = buffer.join("");
				buffer.splice(0);
				isInterWord = true;
				result.push(part);
				return;
			}
		}

		isInterWord = false;

		if (hasLeadingBackslash) {
			buffer.push(char);
			hasLeadingBackslash = false;
			return;
		}

		if (char === `'`) {
			switch (withinQuote) {
				case "NONE":
					withinQuote = "SINGLE";
					return;
				case "SINGLE":
					withinQuote = "NONE";
					return;
				case "DOUBLE":
					buffer.push(`'`);
					return;
				default:
					throw new Error();
			}
		}

		if (char === `"`) {
			switch (withinQuote) {
				case "NONE":
					withinQuote = "DOUBLE";
					return;
				case "SINGLE":
					buffer.push(`"`);
					return;
				case "DOUBLE":
					withinQuote = "NONE";
					return;
				default:
					throw new Error();
			}
		}

		if (char === "\\") {
			hasLeadingBackslash = true;
			return;
		}

		buffer.push(char);
	});

	if (withinQuote !== "NONE" || hasLeadingBackslash) {
		// fallback to simple split
		return line.split(whitespaces);
	}

	return result;
};

export default { parseCommand };
