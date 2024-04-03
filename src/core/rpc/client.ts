import { ExhaustivenessError } from "../../utils/exhaustiveness-error.js";
import { withResolvers } from "../../utils/with-resolvers.js";
import type { Message, Request, Transport } from "./types.js";

const randomId = () => Math.random().toString();

export const createClient = <
	// biome-ignore lint/suspicious/noExplicitAny:
	Methods extends Record<string, (...args: any) => any>,
>(
	transport: Transport,
) => {
	// biome-ignore lint/suspicious/noExplicitAny:
	type Pending = ReturnType<typeof withResolvers<any>>;

	const pendings = new Map<string, Pending>();

	transport.onRecv((raw) => {
		const message: Message = JSON.parse(raw);
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

	type MethodNames = string &
		keyof {
			[K in keyof Methods]: K extends string ? K : never;
		};

	const call = <Method extends MethodNames>(
		method: Method,
		...params: Parameters<Methods[Method]>
	) => {
		const id = randomId();

		const req: Request = {
			id: id,
			kind: "request",
			method: method,
			params: params,
		};

		const pend = withResolvers<ReturnType<Methods[Method]>>();
		pendings.set(id, pend);

		transport.send(JSON.stringify(req));

		return pend.promise;
	};

	return {
		call,
	};
};
