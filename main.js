import robot from "kbm-robot";
import tmi from "tmi.js";
import ui from "./ui.js";
import { commands, aliases, isEnabled, resetState } from "./commands.js";
import process from "node:process";
import { spawn } from "node:child_process";

process.title = "FNaF 3 Twitch Bot";

export const commandCounts = new Map(Array.from(commands.keys(), command => [command, 0]));

let isPaused = true;
let isExecuting = false;
export let commandInterval = 4;

ui.init(interval => {
	commandInterval = interval;
	clearTimeout(timeout);
	timeout = setTimeout(executeTopCommand, interval * 1000);
	if (isPaused || isExecuting) return;
	commandCounts.forEach((_, command) => commandCounts.set(command, 0));
});

const bot = new tmi.Client({
	channels: ["astralspiff"],
	options: {
		skipMembership: true,
		skipUpdatingEmotesets: true
	},
	// Give a dummy logger to prevent connection errors being printed
	// Possibly replace this with a logger that works with ui.js?
	logger: { info: () => {}, warn: () => {}, error: () => {} }
});

bot.on("message", (channel, tags, message, self) => {
	if (isPaused || isExecuting || !message.startsWith("!")) return;
	let command = message.slice(1).toLowerCase();
	if (aliases.has(command)) command = aliases.get(command);
	if (!commandCounts.has(command)) return;
	commandCounts.set(command, commandCounts.get(command) + 1);
});

const ahk = spawn("C:\\Program Files\\AutoHotkey\\v2\\AutoHotkey64.exe", ["ahk.ahk"]);
ahk.stdout.setEncoding("ascii");
ahk.stdout.on("data", data => {
	for (const char of data) {
		if (char === "r") {
			isExecuting = false;
			resetState();
			ui.updateState();
			if (isPaused) return;
			commandCounts.forEach((_, command) => commandCounts.set(command, 0));
			timeout.refresh();
		} else if (char === "p") {
			isPaused = !isPaused;
			ui.updatePauseState(isPaused);
			if (isExecuting) return;
			if (isPaused) {
				commandCounts.forEach((_, command) => commandCounts.set(command, 0));
			} else {
				timeout.refresh();
			}
		} else if (char === "c") {
			commandFinished();
		}
	}
});

const commandFinished = () => {
	isExecuting = false;
	ui.updateState();
	if (isPaused) return;
	timeout.refresh();
};

const executeTopCommand = () => {
	ui.updateCommands(commandCounts);
	if (isPaused || isExecuting) return;
	let topCommand;
	let topCommandCount = 0;
	for (const [command, count] of commandCounts) {
		if (count > topCommandCount && isEnabled(command)) {
			topCommand = command;
			topCommandCount = count;
		}
		commandCounts.set(command, 0);
	}
	if (!topCommand) {
		timeout.refresh();
		return;
	}
	isExecuting = true;
	commands.get(topCommand)(robot).then(row => {
		if (row !== undefined) {
			ahk.stdin.write(row.toString());
			robot.press("VK_F24").release("VK_F24").go();
		} else {
			commandFinished();
		}
	});
};

bot.connect();
robot.startJar();

process.on("beforeExit", code => {
	robot.stopJar();
	bot.disconnect();
	ahk.kill();
});

let timeout = setTimeout(executeTopCommand, commandInterval * 1000);
