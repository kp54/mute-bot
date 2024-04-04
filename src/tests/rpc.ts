import { createRpcClient } from "../core/rpc/client.js";
import { createRpcServer } from "../core/rpc/server.js";
import type { RpcTransport } from "../core/rpc/types.js";
import { assertEqual } from "./assertion.js";

type Methods = {
	add: (x: number, y: number) => number;
	repeat: (seq: string, n: number) => string;
	split: (str: string) => string[];
	everything: () => number;
	void: (foo: number) => void;
};

const mockTransport = (): RpcTransport => {
	const handlers: ((x: string) => void)[] = [];

	return {
		onRecv: (handler) => {
			handlers.push(handler);
		},
		send: (message) => {
			for (const handler of handlers) {
				handler(message);
			}
		},
	};
};

export const testRpc = async () => {
	console.log("testing for rpc client and server");

	const transport = mockTransport();

	const client = createRpcClient<Methods>(transport);

	createRpcServer<Methods>(transport, {
		add: (x, y) => x + y,
		repeat: (seq, n) => new Array(n).fill(seq).join(""),
		split: (str) => str.split(" "),
		everything: () => 42,
		void: (foo) => {},
	});

	const cases = [
		[["add", [2, 3]], 5],
		[["repeat", ["spam", 3]], "spamspamspam"],
		[
			["split", ["foo bar baz"]],
			["foo", "bar", "baz"],
		],
		[["everything", []], 42],
		[["void", [42]], undefined],
	] as const;

	for (const [input, expected] of cases) {
		const [method, args] = input;
		const actual = await client.call(method, ...args);
		assertEqual<unknown>(input, actual, expected);
	}
};
