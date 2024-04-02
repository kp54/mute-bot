export type Timers = {
	setTimeout: (
		callback: (() => unknown) | (() => Promise<unknown>),
		ms: number,
	) => TimeoutId;
	clearTimeout: (timeoutId: TimeoutId) => void;
	setInterval: (
		callback: (() => unknown) | (() => Promise<unknown>),
		ms: number,
	) => IntervalId;
	clearInterval: (intervalId: IntervalId) => void;
};

type TimeoutId = { __timeoutId: never; value: NodeJS.Timeout };
type IntervalId = { __intervalId: never; value: NodeJS.Timeout };

const wrapTimeoutId = (value: NodeJS.Timeout): TimeoutId =>
	({ value }) as TimeoutId;

const wrapIntervalId = (value: NodeJS.Timeout): IntervalId =>
	({ value }) as IntervalId;

const wrapFunc = (
	func: (() => unknown) | (() => Promise<unknown>),
	onError: (e: unknown) => unknown,
) => {
	const wrapped = async () => {
		try {
			await func();
		} catch (e) {
			onError(e);
		}
	};

	return () => {
		// eslint-disable-next-line no-void
		void wrapped();
	};
};

/* eslint-disable no-restricted-globals */
export const createTimers = (onError: (e: unknown) => unknown): Timers => ({
	setTimeout: (callback, ms) =>
		wrapTimeoutId(setTimeout(wrapFunc(callback, onError), ms)),
	clearTimeout: (timeoutId) => clearTimeout(timeoutId.value),
	setInterval: (callback, ms) =>
		wrapIntervalId(setInterval(wrapFunc(callback, onError), ms)),
	clearInterval: (intervalId) => clearInterval(intervalId.value),
});
