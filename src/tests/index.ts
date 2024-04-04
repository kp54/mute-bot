import { testParseCommand } from "./parse-command.js";
import { testRpc } from "./rpc.js";

(() => {
	testParseCommand();
	testRpc();
})();
