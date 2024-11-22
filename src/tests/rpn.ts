import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { evaluate } from "../features/rpn/core.js";

describe("test for rpn core", () => {
	it("should return 'Empty' if input is empty", () => {
		assert.deepEqual(evaluate([]), ["Empty"]);
	});

	it("should return 'Bottom' if stack bottom hit", () => {
		const result = evaluate(["="]);
		assert.deepEqual(result[0], "Bottom");
	});

	it("should return 'NaN' if reaches NaN", () => {
		const result = evaluate(["a"]);
		assert.deepEqual(result[0], "NaN");
	});

	it("should return 'Infinity' if reaches infinity", () => {
		const result = evaluate(["1", "0", "/"]);
		assert.deepEqual(result[0], "Infinity");
	});

	it("should return 'Ok' for one operand", () => {
		const result = evaluate(["42"]);
		assert.deepEqual(result[0], "Ok");
	});

	it("should return '' for '3 3 +'", () => {
		assert.deepEqual(evaluate(["3", "3", "+"]), ["Ok", ""]);
	});

	it("should return '6' for '3 3 + ='", () => {
		assert.deepEqual(evaluate(["3", "3", "+", "="]), ["Ok", "6"]);
	});

	it("should return '0' for '3 3 - ='", () => {
		assert.deepEqual(evaluate(["3", "3", "-", "="]), ["Ok", "0"]);
	});

	it("should return '9' for '3 3 * ='", () => {
		assert.deepEqual(evaluate(["3", "3", "*", "="]), ["Ok", "9"]);
	});

	it("should return '1' for '3 3 / ='", () => {
		assert.deepEqual(evaluate(["3", "3", "/", "="]), ["Ok", "1"]);
	});

	it("should return '1, 2' for '5 3 % $'", () => {
		assert.deepEqual(evaluate(["5", "3", "%", "$"]), ["Ok", "1, 2"]);
	});

	it("should return '8' for '2 3 ^ ='", () => {
		assert.deepEqual(evaluate(["2", "3", "^", "="]), ["Ok", "8"]);
	});

	it("should return '3' for '8 2 ~ ='", () => {
		assert.deepEqual(evaluate(["8", "2", "~", "="]), ["Ok", "3"]);
	});

	it("should return '1' for '1 2 _ ='", () => {
		assert.deepEqual(evaluate(["1", "2", "_", "="]), ["Ok", "1"]);
	});

	it("should return '1, 1' for '1 . $'", () => {
		assert.deepEqual(evaluate(["1", ".", "$"]), ["Ok", "1, 1"]);
	});

	it("should return '2, 3, 1' for '1 2 3 < $'", () => {
		assert.deepEqual(evaluate(["1", "2", "3", "<", "$"]), ["Ok", "2, 3, 1"]);
	});

	it("should return '3, 1, 2' for '1 2 3 > $'", () => {
		assert.deepEqual(evaluate(["1", "2", "3", ">", "$"]), ["Ok", "3, 1, 2"]);
	});
});
