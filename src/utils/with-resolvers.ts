export const withResolvers = <T = never>() => {
	let resolve!: (value: T | PromiseLike<T>) => void;
	// biome-ignore lint/suspicious/noExplicitAny:
	let reject!: (reason: any) => void;

	const promise = new Promise<T>((res, rej) => {
		resolve = res;
		reject = rej;
	});

	return {
		promise,
		resolve,
		reject,
	};
};
