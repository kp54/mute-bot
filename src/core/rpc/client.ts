import { ExhaustivenessError } from "../../utils/exhaustiveness-error.js";
import { withResolvers } from "../../utils/with-resolvers.js";
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
	type Pending = ReturnType<typeof withResolvers<unknown>>;

	const pendings = new Map<string, Pending>();

	transport.onRecv((raw) => {
		const message: RpcMessage = JSON.parse(raw);
		if (message.kind === "request") {
			return;
		}

		const pend = pendings.get(message.id);
		if (pend === undefined) {
			throw new Error();
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

		const pend = withResolvers<unknown>();
		pendings.set(id, pend);

		transport.send(JSON.stringify(req));

		return pend.promise;
	};

	return {
		call,
	} as RpcClient<T>;
};
