export type Transport = {
	send: (message: string) => void;
	onRecv: (handler: (message: string) => void) => void;
};

export type Request = {
	id: string;
	kind: "request";
	method: string;
	params: unknown[];
};

export type Result = {
	id: string;
	kind: "result";
	result: unknown;
};

export type Error = {
	id: string;
	kind: "error";
	message: string;
};

export type Response = Result | Error;

export type Message = Request | Response;
