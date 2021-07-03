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
                    command: "Fetches all songs from a playlist and adds them to the music queue.",
                    arguments: [
                        {
                            _: 'Playlist',
                            d: 'The name of a playlist.',
                            optional: false
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
                    command: "Lists all available playlists or songs within a specified playlist.",
                    arguments: [
                        {
                            _: 'Playlist',
                            d: 'The name of a playlist.',
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
                    command: "Creates a new server playlist.",
                    arguments: [
                        {
                            _: 'Playlist',
                            d: 'The name of the new playlist.',
                            optional: false
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
                    command: "Adds a video to the specified playlist.",
                    arguments: [
                        {
                            _: 'Playlist',
                            d: 'The name of a playlist.',
                            optional: false
                        },
                        {
                            _: 'Video(s)',
                            d: 'One or more YouTube URLs or the title of a video or playlist.',
                            optional: false
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
                    command: "Removes a playlist from the server.",
                    arguments: [
                        {
                            _: 'Playlist',
                            d: 'The name of a playlist.',
                            optional: false
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
                    command: "Removes a video, or list of videos, from the specified playlist.",
                    arguments: [
                        {
                            _: 'Playlist',
                            d: 'The name of a playlist.',
                            optional: false
                        },
                        {
                            _: 'Video(s)',
                            d: 'One or more YouTube URLs or the title of a video or playlist.',
                            optional: false
                        }
                    ]
                },
                adminOnly: false,
                enabled: true,
                run: (message, data) => groups.music.playlist.remove(message, data)
            }
        ],
        adminOnly: false,
        enabled: true,
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
            arguments: /\s(([\w\s]+)|((<URL:\d+>(,\s?)?)+))/,
            argumentIndexes: [2, 3]
        },
        description: {
            command: "Adds a video, or list of videos, to the music queue.",
            arguments: [
                {
                    _: 'Video(s)',
                    d: 'One or more YouTube URLs or the title of a video or playlist.',
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
            command: /(join)|(vc\b)/
        },
        description: {
            command: "Puts the bot into the requested voice channel."
        },
        adminOnly: false,
        enabled: true,
        run: (message, data) => groups.music.voiceChannel.join(message)
    },
    {
        group: 'music',
        regex: {
            command: /(leave)|(bye)|(dc)/
        },
        description: {
            command: "Removes the bot from the voice channel."
        },
        adminOnly: false,
        enabled: true,
        run: (message, data) => groups.music.voiceChannel.leave(message)
    },
    {
        group: 'music',
        regex: {
            command: /(skip)|(next)/
        },
        description: {
            command: "Skips the current video in the active queue."
        },
        adminOnly: false,
        enabled: true,
        run: (message, data) => groups.music.queue.skip(message)
    },
    {
        group: 'music',
        regex: {
            command: /(stop)/
        },
        description: {
            command: "Stops the active queue."
        },
        adminOnly: false,
        enabled: true,
        run: (message, data) => groups.music.queue.stop(message)
    },
    {
        group: 'music',
        regex: {
            command: /(queue)|(q)/
        },
        description: {
            command: "Lists the videos in the active queue."
        },
        adminOnly: false,
        enabled: true,
        run: (message, data) => groups.music.queue.list(message, data)
    },
    {

        group: 'music',
        regex: {
            command: /(pause)/
        },
        description: {
            command: "Pauses the active queue."
        },
        adminOnly: false,
        enabled: true,
        run: (message, data) => groups.music.queue.pause(message)
    },
    {
        group: 'music',
        regex: {
            command: /(resume)/
        },
        description: {
            command: "Resumes the paused, active queue."
        },
        adminOnly: false,
        enabled: true,
        run: (message, data) => groups.music.queue.resume(message)
    },
    {
        group: 'music',
        regex: {
            command: /(song\?)|(songinfo)/,
            arguments: /\s(([\w\s]+)|((<URL:\d+>(,\s?)?)+))/,
            argumentIndexes: [2, 3]
        },
        description: {
            command: "Gathers information about one or more videos.",
            arguments: [
                {
                    _: 'Video(s)',
                    d: 'One or more YouTube URLs or the title of a video or playlist.',
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
            arguments: /\s(([\w\s]+)|(<URL:\d+>))/,
            argumentIndexes: [2, 3]
        },
        description: {
            command: "Downloads an MP4 audio file of a specified video.",
            arguments: [
                {
                    _: 'Video',
                    d: 'A YouTube URL or the title of a video or playlist.',
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