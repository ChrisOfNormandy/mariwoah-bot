const groups = require('../../groups');

let plList = [
    {
        group: 'music',
        regex: {
            command: /(playlist)|(pl)/
        },
        subcommands: [
            {
                name: "play",
                regex: {
                    arguments: /\s([\w\s]+)|((<URL:\d+>(,\s?)?)+)/,
                    argumentIndexes: [1, 2]
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
                run: (message, data) => groups.music.playlist.play(message, data)
            },
            {
                name: "list",
                regex: {
                    arguments: /\s([\w\s]+)/,
                    argumentIndexes: [1],
                    argsOptional: true
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
                run: (message, data) => groups.music.playlist.list(message, data)
            },
            {
                name: "create",
                regex: {
                    arguments: /\s([\w\s]+)/,
                    argumentIndexes: [1],
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
                run: (message, data) => groups.music.playlist.create(message, data)
            },
            {
                name: "add",
                regex: {
                    arguments: /\s([\w\s]+)\s(([\w\s]+)|((<URL:\d+>(,\s?)?)+))/,
                    argumentIndexes: [1, 2]
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
                run: (message, data) => groups.music.playlist.addSong(message, data)
            },
            {
                name: "delete",
                regex: {
                    arguments: /\s([\w\s]+)|((<URL:\d+>(,\s?)?)+)/,
                    argumentIndexes: [1, 2]
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
                run: (message, data) => groups.music.playlist.delete(message, data)
            },
            {
                name: "remove",
                regex: {
                    arguments: /\s([\w\s]+)\s(([\w\s]+)|((<URL:\d+>(,\s?)?)+))/,
                    argumentIndexes: [1, 2]
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
                run: (message, data) => groups.music.playlist.remove(message, data)
            }
        ],
        adminOnly: false,
        enabled: false,
        run: (message, data) => {
            let arr = plList[0].subcommands.filter((cmd) => { return cmd.name == data.subcommand });
            if (!!arr.length)
                return arr[0].run(message, data);
            return Promise.reject({ content: ['Subcommand not found.'] }); // This should never happen if commands are set up correctly, but just in case.
        }
    }
]

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
    plList[0]
]