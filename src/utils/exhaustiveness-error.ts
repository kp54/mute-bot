export class ExhaustivenessError extends Error {
	constructor(value: never) {
		super(`Unexpected value \`${value}\` given.`);
		this.name = "ExhaustivenessError";
	}
}
