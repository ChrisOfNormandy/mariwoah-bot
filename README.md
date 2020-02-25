# Mariwoah Bot

Misc. utilities bot for discord, written in JavaScript.

Functions in the bot:

* Plays music through voice chat
* Assembles and manages playlists of music to play through voice chat
* Chat minigames (WIP)

> Fishing
> Gambling - slots, blackjack

* Drops an F in chat
* Drops a different F in chat
* Misc. things as I want to add them.

> .? / -? / ~? // .help / -help / ~help

# List of planned features needing implementation

* should have ability to purge / pardon specific warnings. Does not include kicks, bans or ban reverts.
* Saving to important files should happen through a queue system. Use a map: serverID: {[value: {args...}]}...
* modUser.js should be redone. It's trash.
* userInfoList.js should be redone. A lot of the code can be rewritten as a parent function with passed in objects.
* For the love of god, rewrite the roleManager adapter! So much junk that should have unique helper files or parent functions! WTF?
* Slots are broken.
* Fishing returns bad message when fish caught.
* Fishing can probably be rewritten and cleaned.
* Servers should have unique prefixes