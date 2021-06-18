const groups = require('../../groups');

module.exports = [
    {
        group: 'music',
        regex: {
            command: /(play)|(p)/,
            arguments: /\s(((<URL:\d+>(,\s?)?)+)|([\w\s]+))/,
            argumentIndexes: [3, 5]
        },
        description: {
            command: "Plays a song in the voice channel.",
            arguments: [
                {
                    _: 'URL | Title',
                    d: 'A YouTube URL or the title of a video, playlist, channel.',
                    optional: false
                }
            ],
        },
        adminOnly: false,
        enabled: true,
        run: (message, data) => groups.music.queue.add(message, data)
    },
    {
        group: 'music',
        regex: {
            command: /(join)|(vc)/,
            arguments: null,
            argumentIndexes: []
        },
        description: {
            command: "Puts the bot into the requested voice channel.",
            arguments: []
        },
        adminOnly: false,
        enabled: true,
        run: (message, data) => groups.music.voiceChannel.join(message)
    },
    {
        group: 'music',
        regex: {
            command: /(leave)|(bye)|(dc)/,
            arguments: null,
            argumentIndexes: []
        },
        description: {
            command: "Removes the bot from the voice channel.",
            arguments: []
        },
        adminOnly: false,
        enabled: true,
        run: (message, data) => groups.music.voiceChannel.leave(message)
    },
    {
        group: 'music',
        regex: {
            command: /(skip)|(next)/,
            arguments: null,
            argumentIndexes: []
        },
        description: {
            command: "Skips the current song in the active queue.",
            arguments: []
        },
        adminOnly: false,
        enabled: true,
        run: (message, data) => groups.music.queue.skip(message)
    },
    {
        group: 'music',
        regex: {
            command: /(stop)/,
            arguments: null,
            argumentIndexes: []
        },
        description: {
            command: "Stops the active queue.",
            arguments: []
        },
        adminOnly: false,
        enabled: true,
        run: (message, data) => groups.music.queue.stop(message)
    },
    {
        group: 'music',
        regex: {
            command: /(queue)|(q)/,
            arguments: null,
            argumentIndexes: []
        },
        description: {
            command: "Lists the songs in the active queue.",
            arguments: []
        },
        adminOnly: false,
        enabled: true,
        run: (message, data) => groups.music.queue.list(message, data)
    },
    {

        group: 'music',
        regex: {
            command: /(pause)/,
            arguments: null,
            argumentIndexes: []
        },
        description: {
            command: "Pauses the active queue.",
            arguments: []
        },
        adminOnly: false,
        enabled: true,
        run: (message, data) => groups.music.queue.pause(message)
    },
    {
        group: 'music',
        regex: {
            command: /(resume)/,
            arguments: null,
            argumentIndexes: []
        },
        description: {
            command: "Resumes the paused, active queue.",
            arguments: []
        },
        adminOnly: false,
        enabled: true,
        run: (message, data) => groups.music.queue.resume(message)
    },
    {
        group: 'music',
        regex: {
            command: /(song\?)|(songinfo)/,
            arguments: /\s(((<URL:\d+>(,\s?)?)+)|([\w\s]+))/,
            argumentIndexes: [3, 5]
        },
        description: {
            command: "Gathers information about a song.",
            arguments: [
                {
                    _: 'URL | Title',
                    d: 'YouTube url or the title of a video, playlist, channel.',
                    optional: false
                }
            ],
        },
        adminOnly: false,
        enabled: true,
        run: (message, data) => groups.music.song.info(message, data)
    },
    {
        group: 'music',
        regex: {
            command: /(ytdl)/,
            arguments: /\s(((<URL:\d+>(,\s?)?)+)|([\w\s]+))/,
            argumentIndexes: [3, 5]
        },
        description: {
            command: "Downloads an MP4 audio file.",
            arguments: [
                {
                    _: 'URL | Title',
                    d: 'YouTube url or the title of a video, playlist, channel.',
                    optional: false
                }
            ],
        },
        adminOnly: false,
        enabled: true,
        run: (message, data) => groups.music.song.download(data)
    },
    { // Playlist commands that have 1 subcommand.
        group: 'music',
        regex: {
            command: /(playlist)|(pl)/,
            arguments: /\s(\w+)(\s(((<URL:\d+>(,\s?)?)+)|([\w\s]+)))?/,
            subcommand: /(play)|(delete)/,
            argumentIndexes: [3],
            subcommandIndexes: [1]
        },
        description: {
            command: "Playlist commands using one subcommand.",
            arguments: [
                {
                    _: '...',
                    d: 'Use "~pl help" or "~pl ?" for playlist help.',
                    optional: true
                }
            ]
        },
        adminOnly: false,
        enabled: true,
        run: (message, data) => groups.music.playlist(message, data)
    },
    { // Playlist commands that have 2 subcommands.
        group: 'music',
        regex: {
            command: /(playlist)|(pl)/,
            arguments: /\s(\w+)\s(\w+)(\s(((<URL:\d+>(,\s?)?)+)|([\w\s]+)))?/,
            subcommand: /(add)|(remove)/,
            argumentIndexes: [2, 4],
            subcommandIndexes: [1]
        },
        description: {
            command: "Playlist commands using two subcommands.",
            arguments: [
                {
                    _: '...',
                    d: 'Use "~pl help" or "~pl ?" for playlist help.',
                    optional: true
                }
            ]
        },
        adminOnly: false,
        enabled: true,
        run: (message, data) => groups.music.playlist(message, data)
    },
    { // Playlist commands that have 1 subcommand and optional arguments.
        group: 'music',
        regex: {
            command: /(playlist)|(pl)/,
            arguments: /\s(\w+)?(\s(((<URL:\d+>(,\s?)?)+)|([\w\s]+)))?/,
            subcommand: /(list)/,
            argumentIndexes: [3],
            subcommandIndexes: [1],
            argsOptional: true
        },
        description: {
            command: "Playlist commands using one subcommand with optional arguments.",
            arguments: [
                {
                    _: '...',
                    d: 'Use "~pl help" or "~pl ?" for playlist help.',
                    optional: true
                }
            ]
        },
        adminOnly: false,
        enabled: true,
        run: (message, data) => groups.music.playlist(message, data)
    },
]