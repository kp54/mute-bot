export type FeatureId = {
	id: string;
	name: string;
};

export type FeatureMeta = {
	summary: string | null;
	usage: string | null;
};

export type FeatureInstance = FeatureId & FeatureMeta;

export type FeatureBuilder = FeatureId & {
	build: (config: Config, logger: Logger) => Promise<FeatureInstance>;
};

export type CreateClientOptions = {
	config: Config;
	features: FeatureBuilder[];
	logger: Logger;
};

export interface Config {
	core: {
		discordToken: string;
		prefix: string;
	};
}

export type Logger = {
	log: (...values: string[]) => void;
	error: (...values: string[]) => void;
};

export type SetupContext = {
	config: Config;
};
