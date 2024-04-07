import type {
	RpcError,
	RpcMessage,
	RpcMethods,
	RpcResult,
	RpcTransport,
} from "./types.js";

export const createRpcServer = <Methods extends RpcMethods>(
	transport: RpcTransport,
	handlers: {
		[K in keyof Methods as K extends string ? K : never]: Methods[K];
	},
) => {
	transport.onRecv(async (raw) => {
		const message: RpcMessage = JSON.parse(raw);
		if (message.kind !== "request") {
			return;
		}

		if (!(message.method in handlers)) {
			throw new Error();
		}

		const handler = handlers[message.method];

		try {
			const data = await handler(...message.params);

			const result: RpcResult = {
				id: message.id,
				kind: "result",
				result: data,
			};

			transport.send(JSON.stringify(result));
		} catch (e) {
			if (!(e instanceof Error)) {
				throw e;
			}

			const error: RpcError = {
				id: message.id,
				kind: "error",
				message: e.message,
			};

			transport.send(JSON.stringify(error));
		}
	});
};
