import { stdin, stdout } from "node:process";
import { drawTable, drawSimpleTable } from "./table.js";
import { isEnabled, getFormattedState, toggleBoop } from "./commands.js";
import { commandCounts, commandInterval } from "./main.js";

const writeInput = (str, final) => {
	stdout.write(`\x1B[2;12H${" ".repeat(5 - str.length)}\x1B[3${final ? "2" : "3"}m${str}\x1B[m`);
};

const HOME = "\x1B[8;32H";
let cursor = HOME;

stdin.setRawMode(true);
stdin.on("data", data => {
	const str = data.toString();
	if (input === null) {
		if (str === "i") {
			input = "";
			writeInput(input, false);
			cursor = "\x1B[2;17H";
		} else if (str === "b") {
			stdout.write(`\x1B[4;17H${(toggleBoop() ? " \x1B[32mEnabled" : "\x1B[31mDisabled")}\x1B[m${HOME}`);
		}
	} else {
		if (str === "\x0D") {
			const newInterval = Number(input);
			if (newInterval) {
				setNewInterval(newInterval);
				writeInput(newInterval.toString(), true);
			}
			input = null;
			stdout.write(HOME);
			cursor = HOME;
			return;
		} else if (str === "\x08") {
			input = input.slice(0, -1);
		} else if (str.match(/[0-9]/) && input.length < 4) {
			input += str;
		} else if (str === "." && input.length < 4 && !input.includes(".")) {
			input += input.length === 0 ? "0." : ".";
		} else {
			//stdout.write("\x07");
			return;
		}
		writeInput(input, false);
	}
});

let input = null;
let setNewInterval;
let commandCountRow;

const ui = {
	init: newIntervalFunction => {
		const state = getFormattedState();
		setNewInterval = newIntervalFunction;
		stdout.write(drawSimpleTable([["Interval", `\x1B[32m${commandInterval}\x1B[m seconds`], ["State", "\x1B[33mPaused\x1B[m"], ["!boop", "\x1B[32mEnabled\x1B[m"]], 22));
		stdout.write(drawSimpleTable(state, 22));
		stdout.write("\x1B[2;32H[I] Set new interval\x1B[3;32H[B] Toggle !boop command\x1B[5;32H[O] Reset the bot's state   (global hotkey)\x1B[6;32H[P] Pause/resume the bot    (global hotkey)");
		commandCountRow = Object.keys(state).length + 9;
		ui.updateCommands(commandCounts);
	},

	updatePauseState: paused => {
		stdout.write(`\x1B[3;18H${paused ? " \x1B[33mPaused" : "\x1B[32mRunning"}\x1B[m${cursor}`);
	},

	updateState: () => {
		stdout.write("\x1B[6H" + drawSimpleTable(getFormattedState(), 22) + cursor);
	},

	/** @arg {Map<string, number>} commandCounts */
	updateCommands: commandCounts => {
		stdout.write(
			`\x1B[${commandCountRow}H` + drawTable(
				["Command", "Count"],
				Array.from(commandCounts).sort(([cmdA, countA], [cmdB, countB]) => countA === 0 && countB === 0 ? isEnabled(cmdB) - isEnabled(cmdA) : countB - countA).slice(0, 16).map(([cmd, count]) => [`\x1B[${isEnabled(cmd) ? "32" : "90"}m${cmd}\x1B[m`, `\x1B[33m${count}\x1B[m`]),
				[false, true]
			) + cursor
		);
	}
};

export default ui;
