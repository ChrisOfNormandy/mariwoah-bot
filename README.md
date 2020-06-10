# Mariwoah Bot

Misc. utilities bot for discord, written in JavaScript.

Functions the bot performs:

* Plays music through voice chat
* Assembles and manages playlists of music to play through voice chat
* Chat minigames (WIP)
* Basic server utility (warn, kick, ban, unban, list offenses, clean chat)
* Some nice memes

> Prefixes can be custom per server. Default is ~ (tilde).

# List of implemented (full/partial) commands:

* clean | cleans the chat; pinging 1+ users purges their messages. Else, only bot messages and messages with the command prefix of the bot (default ~).
* ? / help | lists some help.
* ping | provides latency between the bot and the server and the delay of discord's messaging.
* roll | rolls a number between 1 and 6 (default); providing a number rolls between 1 and that value. Providing a second number rolls that many times (defulat 1). ~roll 20 5 = 1-20 5 times.
* shuffle | shuffles a list of items: a,b,c,d = c,a,b,d.
* whoami / whoareyou | displays join date and roles of a user.
* setmotd / motd | set and display a message of the day for the server. Good for information users may need often like a game server IP or social links.
* setprefix | allows changing the server's prefix for commands.
* prefix | debugging only ;)

* warn | warns a user and sends a DM.
* kick | kicks a user and sends a DM.
* ban | bans a user and sends a DM.
* unban | unbans a user and sends a DM saying they were unbanned.
* warnings | lists a user's warnings.
* kicks | lists a user's kicks.
* bans | lists a user's bans.

* p / play | plays a song in the user's voice channel
* join | makes the bot join the user's voice channel. Useful for moving the bot.
* leave | disconnects the bot from the voice channel.
* skip | skips the currently playing song.
* stop | stops the currently playing song and disconnects the bot.
* q / queue | lists the active server music queue.
* pause | pauses the current song.
* resume | resumes the current song.
* pl / playlist {subcommand} | playlist commands:
* 

* f | Press F to pay respects.
* fuck | rage comic fffuuu.
* yey | rage comic yey.
* penguin | a nice penguin gif.
* clayhead | a not very nice claymation.
* cr / crabrave | plays Noisestorm's Crabrave (adds to queue) in the user's voice channel.
* theriddle | plays The Riddle by Gigi D'Agostino