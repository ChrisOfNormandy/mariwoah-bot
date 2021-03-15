const groups = require('./app/groups');

module.exports = [
    {
        group: 'utility',
        regex: {
            command: /(clean)/,
            arguments: null,
            argumentIndexes: []
        },
        description: {
            command: "Cleans chat of bot messages and commands. Can be used to clean specific user messages.",
            arguments: [
                { "*@User(s)": "User ping(s)." }
            ]
        },
        adminOnly: true,
        settings: {
            "responseClear": {
                delay: 10
            }
        },
        enabled: true,
        run: (message, data) => groups.utility.clean(message, data)
    },
    {
        group: 'general',
        regex: {
            command: /(ping)/,
            arguments: null,
            argumentIndexes: []
        },
        description: {
            command: "Gauge Discord's message latency.",
            arguments: []
        },
        adminOnly: false,
        settings: {
            "commandClear": {
                delay: 0
            }
        },
        enabled: true,
        run: (message, data) => groups.general.ping(message)
    },
    {
        group: 'utility',
        regex: {
            command: /(roll)|(r)|(d)/,
            arguments: /\s?([1-9][0-9]*)(\s([1-9][0-9]*))?/,
            argumentIndexes: [1, 3]
        },
        description: {
            command: "Rolls a number between 1 and a given value, default 6. Can be done multiple times.",
            arguments: [
                { "*Sides": "The number to roll to, default being 6." },
                { "*Count": "How many rolls should be made. Requires sides declairation. Max 50." }
            ]
        },
        adminOnly: false,
        enabled: true,
        run: (message, data) => groups.utility.roll(data.arguments)
    },
    // { // Arguments only accepts 3 values for some reason...
    //     group: 'utility',
    //     regex: {
    //         command: /(shuffle)/,
    //         arguments: /\s((([^",\s]+)|("([^"\\]*(?:\\[^,][^"\\]*)*)"))(,\s?)?)+/,
    //         argumentIndexes: [0]
    //     },
    //     description: {
    //         command: "Shuffles a set of csv values.",
    //         arguments: [
    //             { "List": "Comma separated values list - ex: 1,2,3,4,5" }
    //         ]
    //     },
    //     adminOnly: false,
    //     enabled: true,
    //     run: (message, data) => {
    //         return new Promise((resolve, reject) => {
    //             groups.common.bot.global.shuffle(data.arguments[0].split(/,\s*/))
    //                 .then(arr => resolve({ values: arr, content: [arr.join(', ')] }))
    //                 .catch(e => reject({ rejections: [e], content: [] }));
    //         });
    //     }
    // },
    {
        group: 'general',
        regex: {
            command: /(whoami)|(me)/,
            arguments: null,
            argumentIndexes: []
        },
        description: {
            command: "Gathers and displays information about yourself.",
            arguments: []
        },
        adminOnly: false,
        settings: {
            "commandClear": {
                delay: 0
            },
            "responseClear": {
                delay: 30
            }
        },
        enabled: true,
        run: (message, data) => groups.general.whois.self(message)
    },
    {
        group: 'general',
        regex: {
            command: /(whoareyou)|(whoru)|(whois)/,
            arguments: null,
            argumentIndexes: []
        },
        description: {
            command: "Gathers and displays information about another user.",
            arguments: [
                { "@User": "User ping." }
            ]
        },
        adminOnly: false,
        settings: {
            "commandClear": {
                delay: 0
            },
            "responseClear": {
                delay: 30
            }
        },
        enabled: true,
        run: (message, data) => groups.general.whois.member(message)
    },
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
                { "Song": "Video title | YouTube URL(s)" }
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
            command: "Puts the bot into the requested voice channel."
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
            command: "Removes the bot from the voice channel."
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
            command: "Skips the current song in the active queue."
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
            command: "Stops the active queue."
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
            command: "Lists the songs in the active queue."
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
            command: "Pauses the active queue."
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
            arguments: /\s(((<URL:\d+>(,\s?)?)+)|([\w\s]+))/,
            argumentIndexes: [3, 5]
        },
        description: {
            command: "Gathers information about a song.",
            arguments: [
                {"Song": "Video title | YouTube URL"}
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
                {"Song": "Video title | YouTube URL"}
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
        run: (message, data) => groups.music.playlist(message, data)
    }
]