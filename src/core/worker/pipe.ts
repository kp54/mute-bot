import type { MessagePort } from "node:worker_threads";
import type { Message, MessageHandler, Pipe } from "./types.js";

const randomId = () => Math.random().toString();

export const wrapWorkerPort = (
	worker: Worker,
	handler: MessageHandler,
): Pipe => {
	const post = (payload: unknown) =>
		new Promise<unknown>((resolve) => {
			const requestId = randomId();

			const onMessage = (ev: MessageEvent<Message>) => {
				const message = ev.data;
				if (message.kind === "response" && message.requestId === requestId) {
					worker.removeEventListener("message", onMessage);
					resolve(message.payload);
				}
			};

			const request: Message = {
				kind: "request",
				requestId,
				payload,
			};

			worker.addEventListener("message", onMessage);
			worker.postMessage(request);
		});

	// eslint-disable-next-line @typescript-eslint/no-misused-promises
	worker.addEventListener("message", async (ev: MessageEvent<Message>) => {
		const message = ev.data;
		if (message.kind !== "request") {
			return;
		}

		const result = await handler(message.payload);

		const response: Message = {
			kind: "response",
			requestId: message.requestId,
			payload: result,
		};

		worker.postMessage(response);
	});

	return {
		post,
	};
};

export const wrapParentPort = (
	parentPort: MessagePort,
	handler: MessageHandler,
): Pipe => {
	const post = (payload: unknown) =>
		new Promise<unknown>((resolve) => {
			const requestId = randomId();

			const onMessage = (message: Message) => {
				if (message.kind === "response" && message.requestId === requestId) {
					parentPort.off("message", onMessage);
					resolve(message.payload);
				}
			};

			const request: Message = {
				kind: "request",
				requestId,
				payload,
			};

			parentPort.on("message", onMessage);
			parentPort.postMessage(request);
		});

	// eslint-disable-next-line @typescript-eslint/no-misused-promises
	parentPort.on("message", async (message: Message) => {
		if (message.kind !== "request") {
			return;
		}

		const result = await handler(message.payload);

		const response: Message = {
			kind: "response",
			requestId: message.requestId,
			payload: result,
		};

		parentPort.postMessage(response);
	});

	return {
		post,
	};
};
