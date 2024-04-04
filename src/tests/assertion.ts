const typeof_ = <T>(value: T) => {
	if (value === null) {
		return "null";
	}

	return typeof value;
};

const isEqual = (actual: unknown, expected: unknown): boolean => {
	if (typeof_(actual) !== typeof_(expected)) {
		return false;
	}

	if (Array.isArray(actual) && Array.isArray(expected)) {
		if (actual.length !== expected.length) {
			return false;
		}

		for (let i = 0; i < expected.length; i++) {
			if (!isEqual(actual[i], expected[i])) {
				return false;
			}
		}

		return true;
	}

	return actual === expected;
};

export const assertEqual = <T>(case_: unknown, actual: T, expected: T) => {
	if (isEqual(actual, expected)) {
		console.log(
			[
				"[PASS]",
				`case: ${JSON.stringify(case_)},`,
				`expected: ${JSON.stringify(expected)},`,
			].join(" "),
		);
	} else {
		console.log(
			[
				"[FAIL]",
				`case: ${JSON.stringify(case_)},`,
				`expected: ${JSON.stringify(expected)},`,
				`actual: ${JSON.stringify(actual)}`,
			].join(" "),
		);
	}
};
