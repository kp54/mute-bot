import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { parseCommand } from "../core/client/parse-command.js";

describe("test for parseCommand", () => {
	it("sould split words by spaces", () => {
		assert.deepEqual(parseCommand("a s d f"), ["a", "s", "d", "f"]);
	});

	it("should preserve quoted spaces", () => {
		assert.deepEqual(parseCommand(`a ' s ' d`), ["a", " s ", "d"]);
	});

	it("should parse quoted quotes", () => {
		assert.deepEqual(parseCommand(`'a " s ' d`), ['a " s ', "d"]);
	});

	it("should ignore escaped quotes", () => {
		assert.deepEqual(parseCommand(`'a\\'s' "d\\"f"`), [`a's`, `d"f`]);
	});

	it("should ignore continuous spaces", () => {
		assert.deepEqual(parseCommand(`' a '  s  d`), [" a ", "s", "d"]);
	});

	it("should leading and trailing spaces", () => {
		assert.deepEqual(parseCommand(" a s "), ["a", "s"]);
	});

	it("should preserve quoted empty elements", () => {
		assert.deepEqual(parseCommand(`' ' ''`), [" ", ""]);
	});

	it("should accept single and double quotes", () => {
		assert.deepEqual(parseCommand(`'a s'  "d f"`), ["a s", "d f"]);
	});

	it("should fallback to plain split if match fails", () => {
		assert.deepEqual(parseCommand(`who's who`), [`who's`, "who"]);
	});
});
