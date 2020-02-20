# Music general - Subsect of music

Provides indirect access to helper files for general music related functions.

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