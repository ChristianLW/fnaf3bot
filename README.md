# Twitch Plays FNaF 3 Bot
This bot was originally made for the amazing [AstralSpiff](https://www.youtube.com/@AstralSpiff).
Then stream in which it was used has been turned into a video, which you can see [here](https://www.youtube.com/watch?v=8NX8YyzyyqQ).
You can also see the VOD of the stream [here](https://www.youtube.com/watch?v=WgqOerUrMuI).

The bot goes through a cycle of first waiting for a specific amount of time, where it will tally up commands sent by Twitch chat.
After a specific amount of time, the bot looks at the total and picks the highest voted command, which it then executes.

The bot is made in a fairly modular fassion that means it would be quite easy to modify it for a different game.
Almost all game-specific code is in `commands.js`, with a tiny bit in `ui.js` (toggling the !boop command) and the title of the window in `main.js`.
There is also `ahk.ahk` which handles global hotkeys as well as checking when reboots finish.

Feel free to look around in the code and take inspiration, but please message me first if you're going to base something heavily off this.

# Known Issues
- There is a visual glitch where it looks like the wrong thing is being rebooted. This is purely visual and the proper system is actually being rebooted.
- Phantoms tend to break/confuse the bot. Both Spiff and I completely forgot they existed until the bot actually got used.
- If you reboot the camera or audio system while a ventilation error is occuring, the bot will break. This is due to the way the bot detects when reboots have finished.
