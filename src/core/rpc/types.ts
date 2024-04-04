export type RpcTransport = {
	send: (message: string) => void;
	onRecv: (handler: (message: string) => void) => void;
};

export type RpcRequest = {
	id: string;
	kind: "request";
	method: string;
	params: unknown[];
};

export type RpcResult = {
	id: string;
	kind: "result";
	result: unknown;
};

export type RpcError = {
	id: string;
	kind: "error";
	message: string;
};

export type RpcMessage = RpcRequest | RpcResult | RpcError;
