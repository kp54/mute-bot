import config from "./config.local.ts";
import { createClient } from "./core/client/index.ts";
import { createConsoleLogger } from "./core/logger.ts";
import { autoThread } from "./features/auto-thread/index.ts";
import { echo } from "./features/echo/index.ts";
import { hitAndBlow } from "./features/hit-and-blow/index.ts";
import { ping } from "./features/ping/index.ts";
import { pokemon } from "./features/pokemon/index.ts";
import { remind } from "./features/remind/index.ts";
import { rpn } from "./features/rpn/index.ts";
import { terminate } from "./features/terminate/index.ts";
import { transponder } from "./features/transponder/index.ts";

const client = createClient({
	config,
	features: [
		ping,
		echo,
		pokemon,
		hitAndBlow,
		remind,
		rpn,
		autoThread,
		transponder,
		terminate,
	],
	logger: createConsoleLogger(),
});

await client.run();
