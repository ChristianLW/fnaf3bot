/** @type {Map<string, (_: import("kbm-robot")) => Promise<number | undefined>} */
export const commands = new Map([
	["panel", _ => {
		if (state === "right")
			_.mouseMove(0, 540).sleep(1100);
		return _
			.mouseMove(...c.maintenance_panel)
			.mouseClick("1")
			.go().then(() => { state = "panel"; });
	}],
	["ocams", _ => {
		if (state === "left") return _
			.mouseMove(1919, 540)
			.sleep(1100)
			.mouseMove(...c.cams)
			.mouseClick("1")
			.go().then(() => { state = "cams"; });
		else return _
			.mouseMove(...c.cams)
			.mouseClick("1")
			.go().then(() => { state = "cams"; });
	}],
	["ccams", _ => {
		return _
			.mouseMove(...c.cams)
			.mouseClick("1")
			.go().then(() => { state = "right"; });
	}],
	["boop", _ => {
		if (state === "right")
			_.mouseMove(0, 540).sleep(1100);
		return _
			.mouseMove(...c.boop)
			.mouseClick("1")
			.mouseMove(480, 540)
			.go(() => { state = "left"; });
	}],
	["mute", _ => {
		return _
			.mouseMove(...c.mute)
			.mouseClick("1")
			.mouseMove(480, 540)
			.go();
	}],
	// Camera commands
	["lure", _ => {
		return _
			.mouseMove(...c.lure)
			.mouseClick("1")
			.go();
	}],
	["vtoggle", _ => {
		return _
			.mouseMove(...c.toggle)
			.mouseClick("1")
			.go().then(() => { camLayer = "vents"; });
	}],
	["ctoggle", _ => {
		return _
			.mouseMove(...c.toggle)
			.mouseClick("1")
			.go().then(() => { camLayer = "normal"; });
	}],
	// Maintenance panel commands
	["audio", _ => {
		return _
			.mouseMove(...c.p.audio)
			.mouseClick("1")
			.go().then(() => 1);
	}],
	["camera", _ => {
		return _
			.mouseMove(...c.p.camera)
			.mouseClick("1")
			.go().then(() => 2);
	}],
	["vent", _ => {
		return _
			.mouseMove(...c.p.vent)
			.mouseClick("1")
			.go().then(() => 3);
	}],
	["all", _ => {
		return _
			.mouseMove(...c.p.all)
			.mouseClick("1")
			.go().then(() => 4);
	}],
	["exit", _ => {
		return _
			.mouseMove(...c.p.exit)
			.mouseClick("1")
			.go().then(() => { state = "left"; });
	}],
]);

for (let i = 1; i <= 15; i++) {
	commands.set(i < 10 ? "cam0" + i : "cam" + i, _ => {
		return _
			.mouseMove(...c.c[i - 1])
			.mouseClick(1)
			.go();
	});
}

for (let i = 11; i <= 15; i++) {
	commands.set("seal" + i, _ => {
		return _
			.mouseMove(...c.c[i - 1])
			.mouseClick(1)
			.sleep(10)
			.mouseClick(1)
			.sleep(2000)
			.go();
	});
}

/** @type {Map<string, string>} */
export const aliases = new Map();

for (let i = 1; i < 10; i++) {
	aliases.set(`${i}`, "cam0" + i);
	aliases.set(`0${i}`, "cam0" + i);
	aliases.set(`cam${i}`, "cam0" + i);
}

for (let i = 10; i <= 15; i++) {
	aliases.set(`${i}`, "cam" + i);
}

/** The pixel screen coordinates of various buttons in-game */
const c = {
	maintenance_panel: [797, 1024],
	cams: [1769, 329],
	boop: [1261, 381],
	mute: [213, 61],
	lure: [998, 814],
	toggle: [1000, 928],
	c: [
		// Normal cams
		[1254, 952],
		[1659, 912],
		[1811, 853],
		[1811, 762],
		[1503, 784],
		[1242, 796],
		[1242, 703],
		[1439, 672],
		[1563, 613],
		[1766, 662],
		// Vent cams
		[1250, 572],
		[1366, 738],
		[1526, 822],
		[1685, 710],
		[1732, 907],
	],
	p: {
		audio: [655, 534],
		camera: [655, 613],
		vent: [623, 695],
		all: [589, 844],
		exit: [476, 914],
	}
};

/** @type {"left" | "right" | "cams" | "panel"} */
let state = "left";
/** @type {"normal" | "vents"} */
let camLayer = "normal";
export let boopEnabled = true;

export const toggleBoop = () => boopEnabled = !boopEnabled;

export const isEnabled = cmd => {
	switch (cmd) {
		case "ccams":
			return state === "cams";
		case "ocams":
		case "panel":
		case "mute":
			return state === "left" || state === "right";
		case "boop":
			return boopEnabled && (state === "left" || state === "right");
		// Camera commands
		case "vtoggle":
			return state === "cams" && camLayer === "normal";
		case "ctoggle":
			return state === "cams" && camLayer === "vents";
		case "lure":
		case "cam01":
		case "cam02":
		case "cam03":
		case "cam04":
		case "cam05":
		case "cam06":
		case "cam07":
		case "cam08":
		case "cam09":
		case "cam10":
			return state === "cams" && camLayer === "normal";
		case "cam11":
		case "cam12":
		case "cam13":
		case "cam14":
		case "cam15":
		case "seal11":
		case "seal12":
		case "seal13":
		case "seal14":
		case "seal15":
			return state === "cams" && camLayer === "vents";
		// Maintenance panel commands
		case "audio":
		case "camera":
		case "vent":
		case "all":
		case "exit":
			return state === "panel";
	}
};

export const resetState = () => {
	state = "left";
	camLayer = "normal";
};

export const getFormattedState = () => [
	["State", `\x1B[32m${state}\x1B[m`],
	["Camera Layer", (camLayer === "normal" ? "\x1B[32mNormal" : "\x1B[33mVents") + "\x1B[m"],
];
