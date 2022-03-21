const { Command, Output } = require('@chrisofnormandy/mariwoah-bot');

const groups = require('../../groups');

let plList = [
    new Command(
        'play',
        (message, data) => groups.music.playlist.play(message, data)
    )
        .setRegex(/play/, /\s([\w\s]+)|((<URL:\d+>(,\s?)?)+)/, [1, 2])
        .setCommandDescription('Fetches all songs from a playlist and adds them to the music queue.')
        .setArgumentDescription(0, 'Playlist', 'The name of a playlist.'),
    new Command(
        'list',
        (message, data) => groups.music.playlist.list(message, data)
    )
        .setRegex(/list/, /\s([\w\s]+)/, [1], true)
        .setCommandDescription('Lists all available playlists or songs within a specified playlist.')
        .setArgumentDescription(0, 'Playlist', 'The name of a playlist.', true),
    new Command(
        'create',
        (message, data) => groups.music.playlist.create(message, data)
    )
        .setRegex(/create/, /\s([\w\s]+)/, [1])
        .setCommandDescription('Creates a new server playlist.')
        .setArgumentDescription(0, 'Playlist', 'The name of the new playlist.'),
    new Command(
        'add',
        (message, data) => groups.music.playlist.addSong(message, data)
    )
        .setRegex(/add/, /\s([\w\s]+)\s(([\w\s]+)|((<URL:\d+>(,\s?)?)+))/, [1, 2])
        .setCommandDescription('Adds a video to the specified playlist.')
        .setArgumentDescription(0, 'Playlist', 'The name of a playlist.')
        .setArgumentDescription(1, 'Video(s)', 'One or more YouTube URLs or the title of a video or playlist.'),
    new Command(
        'delete',
        (message, data) => groups.music.playlist.delete(message, data)
    )
        .setRegex(/delete/, /\s([\w\s]+)|((<URL:\d+>(,\s?)?)+)/, [1, 2])
        .setCommandDescription('Removes a playlist from the server.')
        .setArgumentDescription(0, 'Playlist', 'The name of a playlist.'),
    new Command(
        'remove',
        (message, data) => groups.music.playlist.remove(message, data)
    )
        .setRegex(/remove/, /\s([\w\s]+)\s(([\w\s]+)|((<URL:\d+>(,\s?)?)+))/, [1, 2])
        .setCommandDescription('Removes a video, or list of videos, from the specified playlist.')
        .setArgumentDescription(0, 'Playlist', 'The name of a playlist.')
        .setArgumentDescription(1, 'Video(s)', 'One or more YouTube URLs or the title of a video or playlist.')
];

function getPlaylistCommands() {
    let playlistCommand = new Command('music');

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
            (message, data) => groups.music.queue.add(message, data)
        )
            .setRegex(/(play)|(p\b)/, /\s(([\w\s]+)|((<URL:\d+>(,\s?)?)+))/, [2, 3])
            .setCommandDescription('Adds a video, or list of videos, to the music queue.')
            .setArgumentDescription(0, 'Video(s)', 'One or more YouTube URLs or the title of a video or playlist.'),
        new Command(
            'music',
            (message) => groups.music.voiceChannel.join(message)
        )
            .setRegex(/(join)|(vc\b)/)
            .setCommandDescription('Puts the bot into the requested voice channel.'),
        new Command(
            'music',
            (message) => groups.music.voiceChannel.leave(message)
        )
            .setRegex(/(leave)|(bye)|(dc\b)/)
            .setCommandDescription('Removes the bot from the voice channel.'),
        new Command(
            'music',
            (message) => groups.music.queue.skip(message)
        )
            .setRegex(/(skip)|(next)|(n\b)/)
            .setCommandDescription('Skips the current video in the active queue.'),
        new Command(
            'music',
            (message) => groups.music.queue.stop(message)
        )
            .setRegex(/(stop)|(s\b)/)
            .setCommandDescription('Stops the active queue.'),
        new Command(
            'music',
            (message, data) => groups.music.queue.list(message, data)
        )
            .setRegex(/(queue)|(q\b)/)
            .setCommandDescription('Lists the videos in the active queue.'),
        new Command(
            'music',
            (message) => groups.music.queue.loop(message)
        )
            .setRegex(/(loop)/)
            .setCommandDescription('Loops the current track.'),
        new Command(
            'music',
            (message) => groups.music.queue.pause(message)
        )
            .setRegex(/(pause)/)
            .setCommandDescription('Pauses the active queue.')
            .disable(),
        new Command(
            'music',
            (message) => groups.music.queue.resume(message)
        )
            .setRegex(/(resume)/)
            .setCommandDescription('Resumes the paused, active queue.')
            .disable(),
        new Command(
            'music',
            (message, data) => groups.music.song.info(message, data)
        )
            .setRegex(/(song\?)|(songinfo)/, /\s(([\w\s]+)|((<URL:\d+>(,\s?)?)+))/, [2, 3])
            .setCommandDescription('Gathers information about one or more videos.')
            .setArgumentDescription(0, 'Video(s)', 'One or more YouTube URLs or the title of a video or playlist.'),
        new Command(
            'music',
            (message, data) => groups.music.song.download(data)
        )
            .setRegex(/(ytdl)/, /\s(([\w\s]+)|(<URL:\d+>))/, [2, 3])
            .setCommandDescription('Downloads an MP4 audio file of a specified video.')
            .setArgumentDescription(0, 'Video', 'A YouTube URL or the title of a video or playlist.')
    ];
}

/**
 * @type {Command[]}
 */
module.exports = [
    ...getPlaylistCommands(),
    ...getMusicCommands()
];