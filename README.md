# Dread Bot

Misc. utilities bot for discord, written in JavaScript.
This project DOES NOT INCLUDE NODE MODULES.

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

* Bot should save stats on nodemon exit and nodemon crash.
```
{
 “events”: {
     “restart”: “npm run SCRIPT”,
     “start”: “npm run SCRIPT”
   }
}
```
* Bot should load stats on start and insert into a Map().
Accessing elements from the map would be a LOT easier.
When the bot closes, should step through Map() and insert items to an object, then send object to JSON.
```
new Map([['foo', 3], ['bar', {}], ['baz', undefined]])
  .forEach(logMapElements);
```
...
```
..Read file().. => data
data string => JSON object
for (i in object) {
  if (!map.has(object.user.id)) {
    map.set(object.user.id, object)
  }
}
```

* Bot should verify stats being pulled are up-to-date with template.
How this can be done cleanly, I don't know.
Should probably make a helper that steps through the entire template object, and determine if the stats object has that property.
If the property doesn't exist, should default to either the value of the template, or if it's a function thing... make more helpers that create values, idk.

* Need to redo all the new helpers. They're starting to get out of hand.
Helpers => Adapters => Cores
Some cores are acting like adapters for the bot, and some helpers are acting like cores. THIS NEEDS TO STOP!

* Structure of new setup...
Accessing helper parts should be
/src:
  /app:
    /music:
      core.js
      /general:
        adapter.js
        /helpers:
          ...
      /playlists:
        adapter.js
        /helpers:
          ...
    /games:
      core.js
      /fishing:
        adapter.js
        /helpers:
          ...
    /common:
      core.js
      /helpers:
        ...

