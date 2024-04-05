import type { MessagePort, Worker } from "node:worker_threads";
import type { RpcTransport } from "../rpc/types.js";

const MAGIC = "ff4c0876-28ba-4eb4-a1a9-c41fd324b346";

export const wrapWorkerPort = (worker: Worker): RpcTransport => {
	const handlers: ((message: string) => void)[] = [];

	worker.on("message", (data) => {
		if (!Array.isArray(data) || data[0] !== MAGIC) {
			return;
		}

		for (const handler of handlers) {
			handler(data[1]);
		}
	});

	const send = (message: string) => {
		worker.postMessage([MAGIC, message]);
	};

	const onRecv = (handler: (message: string) => void) => {
		handlers.push(handler);
	};

	return {
		send,
		onRecv,
	};
};

export const wrapParentPort = (parentPort: MessagePort): RpcTransport => {
	const handlers: ((message: string) => void)[] = [];

	parentPort.on("message", (data) => {
		if (!Array.isArray(data) || data[0] !== MAGIC) {
			return;
		}

		for (const handler of handlers) {
			handler(data[1]);
		}
	});

	const send = (message: string) => {
		parentPort.postMessage([MAGIC, message]);
	};

	const onRecv = (handler: (message: string) => void) => {
		handlers.push(handler);
	};

	return {
		send,
		onRecv,
	};
};
