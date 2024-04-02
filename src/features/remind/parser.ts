import { DateTime } from "luxon";

const Action = {
	Usage: "Usage",
	Add: "Add",
	List: "List",
	Delete: "Delete",
	Error: "Error",
	Past: "Past",
} as const;

const parseDateTime = (timezone: string, line: string) => {
	const date = DateTime.fromISO(line, { zone: timezone });

	if (!date.isValid) {
		return null;
	}

	return date.toMillis();
};

const parseAfter = (line: string) => {
	const after = Number(line);
	if (Number.isNaN(after) || !Number.isFinite(after)) {
		return null;
	}

	const date = DateTime.utc().plus({ minutes: after });
	if (!date.isValid) {
		return null;
	}

	return date.toMillis();
};

// tuple type helper
const t = <T extends ReadonlyArray<unknown>>(...value: T) => value;

export const parse = (timezone: string, args: string[]) => {
	if (args.length === 0 || args[0] === "help") {
		return t(Action.Usage);
	}

	const [command, ...rest] = args;

	if (command === "after" && 1 < rest.length) {
		const dueAt = parseAfter(rest[0]);
		if (dueAt === null) {
			return t(Action.Error);
		}

		if (dueAt < Date.now()) {
			return t(Action.Past);
		}

		const content = rest.slice(1).join(" ");

		return t(Action.Add, dueAt, content);
	}

	if (command === "at" && 1 < rest.length) {
		const dueAt = parseDateTime(timezone, rest[0]);
		if (dueAt === null) {
			return t(Action.Error);
		}

		if (dueAt < Date.now()) {
			return t(Action.Past);
		}

		const content = rest.slice(1).join(" ");

		return t(Action.Add, dueAt, content);
	}

	if (command === "list") {
		return t(Action.List);
	}

	if (command === "delete") {
		const indexes = rest
			.map((x) => Number(x))
			.filter((x) => Number.isSafeInteger(x));
		return t(Action.Delete, indexes);
	}

	return t(Action.Usage);
};
