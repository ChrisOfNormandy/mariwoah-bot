# Playlist - Subsect of music

Provides indirect access to helper files for playlist related functions.

* play
> (message, playlistName, doShuffle) => Attempts to add songs from playlist of provided name to the active queue. If queue is empty, begins playing first song. Does not override previously playing queue. Shuffle flag allows playlist array shuffling (optional, default false).
* list
> (message, playlistName, pageNumber, includeLinks) => Lists songs in playlist of provided name. PageNumber defaults to 0, each page returns 25 songs.
* listAll
> (message) => Attempts to list all files in the server/playlists directory. Returns rich embedded message in chat listing all file names without listing contents.
* create
> (message, playlistName) => Attempts to create a playlist json file (blank) in the server/playlists directory. Rejects if playlist already exists.
* add
(message, playlistName, songURL, songName) => Attempts to add song by url or by name to the playlist of provided name. Should reject songs already in playlist (by url, does not validate by title). Returns rich embedded message in chat with status of addition alongside song information.
* remove
(message, playlistName, index) => Attempts to remove the song from the playlist of provided name at the given index.