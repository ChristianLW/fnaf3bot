#Requires AutoHotkey v2.0
#NoTrayIcon

stdin := FileOpen("*", "r")
stdout := FileOpen("*", "w")

;rebootX := [1010, 1051, 1093, 1135, 1176]
;rebootY := [528, 614, 688, 839]

arrowsX := 336
arrowsY := [529, 615, 690, 840]

o::{
	stdout.Write("r")
	stdout.Read(0)
}

p::{
	stdout.Write("p")
	stdout.Read(0)
}

F24::{
	y := arrowsY[Integer(stdin.Read(1))]
	while (PixelGetColor(arrowsX, y) !== "0xFFFFFF") {
		Sleep(100)
	}
	stdout.Write("c")
	stdout.Read(0)
}
