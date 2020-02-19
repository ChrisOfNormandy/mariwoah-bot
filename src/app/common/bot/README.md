# Bot - General helper files

Very useful.

adapter.js
> Acts as indirect access point for most helper files.

* config
>
* help
>
* cleanChat
> (message) => Default: bulk deletes messages containing command prefix and messages sent by bots. With ping of user: bulk deletes all messages by specified user. Maximum of 14 days old.
* divideArray
> (array, size) => Takes provided array and splits into array of subarrays of given size. Leftover objects are put in an array with all unfilled slots as "undefined."
* getVoicechat
> (message) => Returns active voice channel of message author.
* ping
> (message, client) => Sends message to chat containing latency between bot host and discord host, latency of sending -> editing a message (chat lag).
* preStartup
> () => Initialization
* printLog
> (client, string, flag) => Prints string to bot output channel in discord.
* reactions
> UNUSED | (message) => Adds a reaction to specific patterns in chat (69 = 'N' 'I' 'C' 'E').
* roll
> (message, args) => Rolls a number between 1 and 'n,' default 6. Maximum rolls allowed is 50, default is 1.
* shuffle
> (message, array) => Shuffles and returns a message in chat with new array. Original array can be formatted certain ways (x,y,z | x, y, z).
* startup
> () => Sets statsMap from file, minigame stats as statsMap.map. Generates fish loot.
* whoami
> (message) => Returns rich embedded message to chat with user information, permission level, discord roles and bot roles.
* whoareyou
> (message) => Returns rich embedded message to chat with provided user (first mention) information, permission level, discord roles and bot roles.

All helper files:

* chatFormats
> chatBreak; colors{}.byName{colorName: '#......'}
* cleanChat
* commandList
> Pulled by listHelp, contains permission levels (used by verification in commandParser).
* config
* divideArray
* getJsonFromFile
> (path) => returns JSON parsed data from file.
* getVC
* intToTimeString
> (seconds) => Returns object with seconds, minutes, hours, time as string, total seconds (original value).
* jsonFileToMap
> (path, fileName, objectName) => Calls getJsonFromFile, returns map instead of JSON object.
* listDir
> (path) => Returns array of file names as strings (including file type - file.txt).
* mapToJson
> (map) => Converts map to standart object, needed for writing to files.
* paths
> Paths of multiple files and directories globally accessed.
* ping
* preStartup
* printLog
* reactions
* readFile
> Should be removed and instead use getJsonFromFile
* roll
* shuffle
* startup
* whoAre