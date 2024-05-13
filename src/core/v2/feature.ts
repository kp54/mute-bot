import { createRpcClient } from "../rpc/client.js";
import { createRpcServer } from "../rpc/server.js";
import type { RpcTransport } from "../rpc/types.js";
import { createWorker } from "../worker/index.js";
import type { FeatureApi, HostApi } from "./api.js";
import type {
	Config,
	FeatureBuilder,
	FeatureId,
	FeatureInstance,
	FeatureMeta,
	Logger,
	SetupContext,
} from "./types.js";

type FeatureDefinition = FeatureId & {
	build: (ctx: SetupContext) => {
		summary: string | null;
		usage: string | null;
		matcher: RegExp;
		onCommand: () => Promise<void>;
	};
};

type WorkerData = {
	config: Config;
};

export const defineFeature = (
	definition: FeatureDefinition,
): FeatureBuilder => {
	const build = async (
		config: Config,
		logger: Logger,
	): Promise<FeatureInstance> => {
		const { transport } = await createWorker(
			import.meta.url,
			"default",
			{},
			(e) => {
				logger.error(`feature ${definition.name} has crashed.`);
			},
		);

		const rpc = createRpcClient<FeatureApi>(transport);
		const meta = await rpc.call("initialize");

		return {
			id: definition.id,
			name: definition.name,
			summary: meta.summary,
			usage: meta.usage,
		};
	};

	const main = (transport: RpcTransport, data: WorkerData) => {
		const { config } = data;
		const host = createRpcClient<HostApi>(transport);

		createRpcServer<FeatureApi>(transport, {
			onMessage: () => {},
			initialize: (): FeatureMeta => {
				const feature = definition.build({ config });

				return {
					summary: feature.summary,
					usage: feature.usage,
				};
			},
		});
	};

	main.id = definition.id;
	main.name = definition.name;
	main.build = build;

	return main;
};
