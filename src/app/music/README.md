# Music

core.js
> Acts as commandParser for playlist subcommands.

queue.js
> Acts as the global bot active queue map for all servers. Accessable by queue.get(message.guild.id) -> activeQueue object. Songs: activeQueue.songs (array[]).

* join
> (message) => Puts the bot into user's active voice channel.
* leave
> (message) => Disconnects the bot from its active voice channel.
* listQueue
> (message) => Lists all songs in the active queue.
* play
> (message, songURL, songName, vc) => Either songURL or songName can be null, but not both. Adds song to active queue and begins playing if queue index is 0 (first added song).
* songInfo
> (message, songURL, songName) => Gathers song information by url or by name. Returns a rich embedded message in chat with song information, does not add to queue.
* removeFromQueue
> (message, index) => Removes song from active queue at the provided index.
* skip
> (message) => Ends dispatcher and attempts to play next song in active queue.
* stop
> (message) => Ends dispatcher and attempts to clear active queue.
* addToPlaylist
> (message, playlistName, songURL, songName) => Calls playlist adapter function 'add,' attempts to add song by url or by name to provided playlist with provided name. Returns a rich embedded message in chat with song information and status.
* createPlaylist
> (message, playlistName) => Calls playlist adapter function 'create,' attempts to write a new playlist JSON file with provided name (playlistName.json). Does not add anything, remains blank.
* listAllPlaylists
> (message) => Calls playlist adapter function 'listAll,' returns rich embedded message in chat listing all files in the playlist directory of the server folder (server_%ID%/playlists/...).
* listPlaylist
> (message, playlistName, includeLinks) => Calls playlist adapter function 'list,' attempts to list all objects in the playlist array in the playlist JSON of given name. Returns a rich embedded message in chat listing all songs.
* playPlaylist
> (message, playlistName, doShuffle) => Calls playlist adapter function 'play,' attempts to add all songs from playlist array to active queue. If active queue is already occupied, adds to queue and does not start playing (no override).
* removeFromPlaylist
> (message, playlistName, index) => Calls playlist adapter function 'remove,' attempts to remove song from playlist of provided name at the provided index.
* playlistCommand
> (message, args) => Switch statement for subcommand. CommandParser -> playlistCommand -> (resolve/reject) -> commandParser -> bot.