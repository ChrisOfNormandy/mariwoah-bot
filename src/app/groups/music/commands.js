const { Command, Output } = require('@chrisofnormandy/mariwoah-bot');

const groups = require('../../groups');

let plList = [
    new Command(
        'playlist',
        'playlist-play',
        (message, data) => groups.music.playlist.play(message, data)
    )
        .setRegex(/play/, /\s([\w\s]+)|((<URL:\d+>(,\s?)?)+)/, [1, 2])
        .setCommandDescription('Fetches all songs from a playlist and adds them to the music queue.')
        .setArgumentDescription(0, 'Playlist', 'The name of a playlist.'),
    new Command(
        'playlist',
        'playlist-list',
        (message, data) => groups.music.playlist.list(message, data)
    )
        .setRegex(/list/, /\s([\w\s]+)/, [1], true)
        .setCommandDescription('Lists all available playlists or songs within a specified playlist.')
        .setArgumentDescription(0, 'Playlist', 'The name of a playlist.', true),
    new Command(
        'playlist',
        'playlist-create',
        (message, data) => groups.music.playlist.create(message, data)
    )
        .setRegex(/create/, /\s([\w\s]+)/, [1])
        .setCommandDescription('Creates a new server playlist.')
        .setArgumentDescription(0, 'Playlist', 'The name of the new playlist.'),
    new Command(
        'playlist',
        'playlist-add',
        (message, data) => groups.music.playlist.addSong(message, data)
    )
        .setRegex(/add/, /\s([\w\s]+)\s(([\w\s]+)|((<URL:\d+>(,\s?)?)+))/, [1, 2])
        .setCommandDescription('Adds a video to the specified playlist.')
        .setArgumentDescription(0, 'Playlist', 'The name of a playlist.')
        .setArgumentDescription(1, 'Video(s)', 'One or more YouTube URLs or the title of a video or playlist.'),
    new Command(
        'playlist',
        'playlist-delete',
        (message, data) => groups.music.playlist.delete(message, data)
    )
        .setRegex(/delete/, /\s([\w\s]+)|((<URL:\d+>(,\s?)?)+)/, [1, 2])
        .setCommandDescription('Removes a playlist from the server.')
        .setArgumentDescription(0, 'Playlist', 'The name of a playlist.'),
    new Command(
        'playlist',
        'playlist-remove',
        (message, data) => groups.music.playlist.remove(message, data)
    )
        .setRegex(/remove/, /\s([\w\s]+)\s(([\w\s]+)|((<URL:\d+>(,\s?)?)+))/, [1, 2])
        .setCommandDescription('Removes a video, or list of videos, from the specified playlist.')
        .setArgumentDescription(0, 'Playlist', 'The name of a playlist.')
        .setArgumentDescription(1, 'Video(s)', 'One or more YouTube URLs or the title of a video or playlist.')
];

function getPlaylistCommands() {
    let playlistCommand = new Command('music', 'playlist');

    playlistCommand.setFunction((message, data) => {
        let sc = playlistCommand.getSubcommand(data.subcommand);

        return sc
            ? sc.run(message, data)
            : Promise.reject(new Output().setError(new Error('Subcommand not found.')));
    })
        .setRegex(/(playlist)|(pl)/)
        .setCommandDescription('Playlist commands.');

    plList.forEach((cmd) => playlistCommand.addSubcommand(cmd.getGroup(), cmd));

    return [playlistCommand];
}

function getMusicCommands() {
    return [
        new Command(
            'music',
            'music-queue-add',
            (message, data) => groups.music.queue.add(message, data)
        )
            .setRegex(/(play)|(p\b)/, /\s(([\w\s]+)|((<URL:\d+>(,\s?)?)+))/, [2, 3])
            .setCommandDescription('Adds a video, or list of videos, to the music queue.')
            .setArgumentDescription(0, 'Video(s)', 'One or more YouTube URLs or the title of a video or playlist.'),
        new Command(
            'music',
            'music-vc-join',
            (message) => groups.music.voiceChannel.join(message)
        )
            .setRegex(/(join)|(vc\b)/)
            .setCommandDescription('Puts the bot into the requested voice channel.'),
        new Command(
            'music',
            'music-vc-leave',
            (message) => groups.music.voiceChannel.leave(message)
        )
            .setRegex(/(leave)|(bye)|(dc\b)/)
            .setCommandDescription('Removes the bot from the voice channel.'),
        new Command(
            'music',
            'music-queue-skip',
            (message) => groups.music.queue.skip(message)
        )
            .setRegex(/(skip)|(next)|(n\b)/)
            .setCommandDescription('Skips the current video in the active queue.'),
        new Command(
            'music',
            'music-queue-stop',
            (message) => groups.music.queue.stop(message)
        )
            .setRegex(/(stop)|(s\b)/)
            .setCommandDescription('Stops the active queue.'),
        new Command(
            'music',
            'music-queue-list',
            (message, data) => groups.music.queue.list(message, data)
        )
            .setRegex(/(queue)|(q\b)/)
            .setCommandDescription('Lists the videos in the active queue.'),
        new Command(
            'music',
            'music-queue-loop',
            (message) => groups.music.queue.loop(message)
        )
            .setRegex(/(loop)/)
            .setCommandDescription('Loops the current track.'),
        new Command(
            'music',
            'music-queue-pause',
            (message) => groups.music.queue.pause(message)
        )
            .setRegex(/(pause)/)
            .setCommandDescription('Pauses the active queue.')
            .disable(),
        new Command(
            'music',
            'music-queue-resume',
            (message) => groups.music.queue.resume(message)
        )
            .setRegex(/(resume)/)
            .setCommandDescription('Resumes the paused, active queue.')
            .disable(),
        new Command(
            'music',
            'music-song-info',
            (message, data) => groups.music.song.info(message, data)
        )
            .setRegex(/(song\?)|(songinfo)/, /\s(([\w\s]+)|((<URL:\d+>(,\s?)?)+))/, [2, 3])
            .setCommandDescription('Gathers information about one or more videos.')
            .setArgumentDescription(0, 'Video(s)', 'One or more YouTube URLs or the title of a video or playlist.'),
        new Command(
            'music',
            'music-song-download',
            (message, data) => groups.music.song.download(data)
        )
            .setRegex(/(ytdl)/, /\s(([\w\s]+)|(<URL:\d+>))/, [2, 3])
            .setCommandDescription('Downloads an MP4 audio file of a specified video.')
            .setArgumentDescription(0, 'Video', 'A YouTube URL or the title of a video or playlist.')
    ];
}

function spotifyCommands() {
    return [
        new Command(
            'spotify',
            'spotify-playlist-get',
            (message, data) => groups.music.spotify.playlist.getPlaylist(message, data)
        )
            .setRegex(/(spotify-playlist)|(spotifypl)/, /\s(<URL:0>)(\s(\d+))?/, [1, 3])
            .setCommandDescription('Gets a Spotify playlist by ID.')
            .setArgumentDescription(0, 'Playlist ID', 'Spotify playlist ID.')
            .setArgumentDescription(1, 'Offset', 'Start list from this track index.', true),
        new Command(
            'spotify',
            'spotify-track-get',
            (message, data) => groups.music.spotify.playlist.getTrack(message, data)
        )
            .setRegex(/(spotify-track)|(spotify)/, /\s(<URL:0>)/, [1])
            .setCommandDescription('Gets a Spotify track by ID.')
            .setArgumentDescription(0, 'Track ID', 'Spotify track ID.'),
        new Command(
            'spotify',
            'spotify-track-find',
            (message, data) => groups.music.spotify.playlist.findTrack(message, data)
        )
            .setRegex(/(spotify-find)|(spotify\?)/, /\s([\w\s]+)/, [1])
            .setCommandDescription('Searches for a track on Spotify.')
            .setArgumentDescription(0, 'Track name', 'Track name to find.'),
        new Command(
            'spotify',
            'spotify-to-youtube',
            (message, data) => groups.music.spotify.playlist.spotifyToYouTube(message, data)
        )
            .setRegex(/(s2yt)/, /\s(<URL:0>)/, [1])
            .setCommandDescription('Fetches a YouTube video matching the Spotify track.')
            .setArgumentDescription(0, 'Track URL', 'Track URL.')
    ];
}

/**
 * @type {Command[]}
 */
module.exports = [
    ...getPlaylistCommands(),
    ...getMusicCommands(),
    ...spotifyCommands()
];