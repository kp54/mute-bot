import { Worker, isMainThread } from "node:worker_threads";
import { wrapWorkerPort } from "./transport.js";
import type { WorkerData } from "./types.js";

export const createWorker = async (
	path: string,
	entry: string,
	data: unknown,
	onError: (e: Error) => void,
) => {
	if (!isMainThread) {
		throw new Error();
	}

	const workerData: WorkerData = {
		path: import.meta.resolve(path),
		entry: entry,
		data: data,
	};

	const worker = new Worker("./shim.js", { workerData });
	worker.on("error", (e) => onError(e));

	const transport = wrapWorkerPort(worker);

	const terminate = () => worker.terminate();

	return {
		transport,
		terminate,
	};
};
