import { isMainThread, parentPort, workerData } from "node:worker_threads";
import { wrapParentPort } from "./transport.js";
import type { WorkerData } from "./types.js";

if (isMainThread || parentPort === null) {
	throw new Error();
}

const { path, entry, data }: WorkerData = workerData;
const { [entry]: main } = await import(path);

const transport = wrapParentPort(parentPort);

await main(transport, data);
