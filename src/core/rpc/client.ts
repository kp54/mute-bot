import { ExhaustivenessError } from "../../utils/exhaustiveness-error.js";
import type {
	RpcClient,
	RpcMessage,
	RpcMethods,
	RpcRequest,
	RpcTransport,
} from "./types.js";

const randomId = () => Math.random().toString();

export const createRpcClient = <T extends RpcMethods>(
	transport: RpcTransport,
): RpcClient<T> => {
	const pendings = new Map<string, PromiseWithResolvers<unknown>>();

	transport.onRecv((raw) => {
		const message: RpcMessage = JSON.parse(raw);
		if (message.kind === "request") {
			return;
		}

		const pend = pendings.get(message.id);
		if (pend === undefined) {
			return;
		}
		pendings.delete(message.id);

		if (message.kind === "result") {
			pend.resolve(message.result);
			return;
		}

		if (message.kind === "error") {
			pend.reject(new Error(message.message));
			return;
		}

		throw new ExhaustivenessError(message);
	});

	const call = (method: string, ...params: unknown[]): Promise<unknown> => {
		const id = randomId();

		const req: RpcRequest = {
			id: id,
			kind: "request",
			method: method,
			params: params,
		};

		const pend = Promise.withResolvers<unknown>();
		pendings.set(id, pend);

		transport.send(JSON.stringify(req));

		return pend.promise;
	};

	return {
		call,
	} as RpcClient<T>;
};
