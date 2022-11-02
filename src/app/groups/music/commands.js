const { Command, Output } = require('@chrisofnormandy/mariwoah-bot');

const groups = require('../../groups');

let plList = [
    new Command(
        'playlist',
        'playlist-play',
        groups.music.playlist.play
    )
        .setRegex(/play/, /\s([\w\s]+)|((<URL:\d+>(,\s?)?)+)/, [1, 2])
        .setCommandDescription('Fetches all songs from a playlist and adds them to the music queue.')
        .setArgumentDescription(0, 'Playlist', 'The name of a playlist.'),
    new Command(
        'playlist',
        'playlist-list',
        groups.music.playlist.list
    )
        .setRegex(/list/, /\s([\w\s]+)/, [1], true)
        .setCommandDescription('Lists all available playlists or songs within a specified playlist.')
        .setArgumentDescription(0, 'Playlist', 'The name of a playlist.', true),
    new Command(
        'playlist',
        'playlist-create',
        groups.music.playlist.create
    )
        .setRegex(/create/, /\s([\w\s]+)/, [1])
        .setCommandDescription('Creates a new server playlist.')
        .setArgumentDescription(0, 'Playlist', 'The name of the new playlist.'),
    new Command(
        'playlist',
        'playlist-add',
        groups.music.playlist.addSong
    )
        .setRegex(/add/, /\s([\w\s]+)\s(([\w\s]+)|((<URL:\d+>(,\s?)?)+))/, [1, 2])
        .setCommandDescription('Adds a video to the specified playlist.')
        .setArgumentDescription(0, 'Playlist', 'The name of a playlist.')
        .setArgumentDescription(1, 'Video(s)', 'One or more YouTube URLs or the title of a video or playlist.'),
    new Command(
        'playlist',
        'playlist-delete',
        groups.music.playlist.delete
    )
        .setRegex(/delete/, /\s([\w\s]+)|((<URL:\d+>(,\s?)?)+)/, [1, 2])
        .setCommandDescription('Removes a playlist from the server.')
        .setArgumentDescription(0, 'Playlist', 'The name of a playlist.'),
    new Command(
        'playlist',
        'playlist-remove',
        groups.music.playlist.remove
    )
        .setRegex(/remove/, /\s([\w\s]+)\s(([\w\s]+)|((<URL:\d+>(,\s?)?)+))/, [1, 2])
        .setCommandDescription('Removes a video, or list of videos, from the specified playlist.')
        .setArgumentDescription(0, 'Playlist', 'The name of a playlist.')
        .setArgumentDescription(1, 'Video(s)', 'One or more YouTube URLs or the title of a video or playlist.')
];

/**
 *
 * @returns
 */
function getPlaylistCommands() {
    let playlistCommand = new Command('music', 'playlist');

    playlistCommand.setFunction((data) => {
        let sc = playlistCommand.getSubcommand(data.subcommand);

        return sc
            ? sc.run(data)
            : new Output().makeError('Subcommand not found.').reject();
    })
        .setRegex(/(playlist)|(pl)/)
        .setCommandDescription('Playlist commands.');

    plList.forEach((cmd) => playlistCommand.addSubcommand(cmd.getGroup(), cmd));

    return [playlistCommand];
}

/**
 *
 * @returns
 */
function getMusicCommands() {
    return [
        new Command(
            'music',
            'music-queue-add',
            groups.music.queue.add
        )
            .setRegex(/(play)|(p\b)/, /\s(([\w\s]+)|((<URL:\d+>(,\s?)?)+))/, [2, 3])
            .setCommandDescription('Adds a video, or list of videos, to the music queue.')
            .setArgumentDescription(0, 'Video(s)', 'One or more YouTube URLs or the title of a video or playlist.'),
        new Command(
            'music',
            'music-vc-join',
            groups.music.voiceChannel.join
        )
            .setRegex(/(join)|(vc\b)/)
            .setCommandDescription('Puts the bot into the requested voice channel.'),
        new Command(
            'music',
            'music-vc-leave',
            groups.music.voiceChannel.leave
        )
            .setRegex(/(leave)|(bye)|(dc\b)/)
            .setCommandDescription('Removes the bot from the voice channel.'),
        new Command(
            'music',
            'music-queue-skip',
            groups.music.queue.skip
        )
            .setRegex(/(skip)|(next)|(n\b)/)
            .setCommandDescription('Skips the current video in the active queue.'),
        new Command(
            'music',
            'music-queue-stop',
            groups.music.queue.stop
        )
            .setRegex(/(stop)|(s\b)/)
            .setCommandDescription('Stops the active queue.'),
        new Command(
            'music',
            'music-queue-list',
            groups.music.queue.list
        )
            .setRegex(/(queue)|(q\b)/)
            .setCommandDescription('Lists the videos in the active queue.'),
        new Command(
            'music',
            'music-queue-loop',
            groups.music.queue.loop
        )
            .setRegex(/(loop)/)
            .setCommandDescription('Loops the current track.'),
        new Command(
            'music',
            'music-queue-pause',
            groups.music.queue.pause
        )
            .setRegex(/(pause)/)
            .setCommandDescription('Pauses the active queue.')
            .disable(),
        new Command(
            'music',
            'music-queue-resume',
            groups.music.queue.resume
        )
            .setRegex(/(resume)/)
            .setCommandDescription('Resumes the paused, active queue.')
            .disable(),
        new Command(
            'music',
            'music-song-info',
            groups.music.song.info
        )
            .setRegex(/(song\?)|(songinfo)/, /\s(([\w\s]+)|((<URL:\d+>(,\s?)?)+))/, [2, 3])
            .setCommandDescription('Gathers information about one or more videos.')
            .setArgumentDescription(0, 'Video(s)', 'One or more YouTube URLs or the title of a video or playlist.'),
        new Command(
            'music',
            'music-song-download',
            groups.music.song.download
        )
            .setRegex(/(ytdl)/, /\s(([\w\s]+)|(<URL:\d+>))/, [2, 3])
            .setCommandDescription('Downloads an MP4 audio file of a specified video.')
            .setArgumentDescription(0, 'Video', 'A YouTube URL or the title of a video or playlist.')
    ];
}

/**
 *
 * @returns
 */
function spotifyCommands() {
    return [
        new Command(
            'spotify',
            'spotify-playlist-get',
            groups.music.spotify.getPlaylist
        )
            .setRegex(/(spotify-playlist)|(spotifypl)/, /\s(<URL:0>)(\s(\d+))?/, [1, 3])
            .setCommandDescription('Gets a Spotify playlist by ID.')
            .setArgumentDescription(0, 'Playlist ID', 'Spotify playlist ID.')
            .setArgumentDescription(1, 'Offset', 'Start list from this track index.', true),
        new Command(
            'spotify',
            'spotify-track-get',
            groups.music.spotify.getTrack
        )
            .setRegex(/(spotify-track)|(spotify)/, /\s(<URL:0>)/, [1])
            .setCommandDescription('Gets a Spotify track by ID.')
            .setArgumentDescription(0, 'Track ID', 'Spotify track ID.'),
        new Command(
            'spotify',
            'spotify-track-find',
            groups.music.spotify.findTrack
        )
            .setRegex(/(spotify-find)|(spotify\?)/, /\s([\w\s]+)/, [1])
            .setCommandDescription('Searches for a track on Spotify.')
            .setArgumentDescription(0, 'Track name', 'Track name to find.'),
        new Command(
            'spotify',
            'spotify-to-youtube',
            groups.music.spotify.spotifyToYouTube
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