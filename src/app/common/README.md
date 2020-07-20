# General uncategorized and misc. utility functions

Includes globally accessable helper files and permissions management.

core.js
> Provides indirect (pass-through) access to all features of the bot. Allows easier access for bot requires (common.{sect}).

* client
> bot.preStartup(); Runs initialization.
* bot
> Adapter file for general functions.
* minigames
> minigames/core.js
* music
> music/core.js
* roleManager
> roleManager/adapter.js
* dungeons
> dungeons/core.js
* log
> (string, flag) => prints string to bot output channel in discord.
* listHelp
> (message, args) => bot.listHelp(...); Lists help; no arguments returns all sections of the bot. With arguments, section of bot, returns list of commands with description, arguments, etc... for all commands valid to user (permission level).