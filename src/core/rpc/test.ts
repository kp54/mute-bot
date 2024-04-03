import { createClient } from "./client.js";
import type { Transport } from "./types.js";

const dummyTransport: Transport = null!;

type Methods = {
	repeat: (seq: string, count: number) => string[];
	add: (x: number, y: number) => number;
	1: () => void;
};

const client = createClient<Methods>(dummyTransport);

client.call("add", 1, 3);
client.call("repeat", "spam", 3);
