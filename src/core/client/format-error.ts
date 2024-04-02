export const formatError = (e: Error): string => {
	const lines = [`${e.name}: ${e.message}`, e.stack];

	if (e.cause instanceof Error) {
		lines.push(formatError(e.cause));
	}

	return lines.join("\n");
};
