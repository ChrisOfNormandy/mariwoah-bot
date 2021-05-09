const groups = require('./app/groups');

const list = [
    {
        group: 'general',
        regex: {
            command: /(\?)|(help)/,
            arguments: /\s?([\w\?]+)?/,
            argumentIndexes: [1]
        },
        description: {
            command: "Displays a list of commands and syntaxes.",
            arguments: [
                {
                    _: "Command",
                    d: "A command string.",
                    optional: true
                }
            ]
        },
        adminOnly: false,
        settings: {
            "responseClear": {
                delay: 30
            },
            "commandClear": {
                delay: 0
            }
        },
        enabled: true,
        run: (message, data) => groups.general.help(message, data, list)
    },
    {
        group: 'utility',
        regex: {
            command: /(clean)/,
            arguments: /\s@(.+)/,
            argumentIndexes: [1],
            argsOptional: true
        },
        description: {
            command: "Cleans chat of bot messages and commands. Can be used to clean specific user messages.",
            arguments: [
                {
                    _: '@User | @Users',
                    d: 'Ping of one ore more users.',
                    optional: true
                }
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
            command: /(roll)|(r\d+)|(d\d+)/,
            arguments: /\s?([1-9][0-9]*)?(\s([1-9][0-9]*))?/,
            argumentIndexes: [1, 3]
        },
        description: {
            command: "Rolls a number between 1 and a given value.",
            arguments: [
                {
                    _: 'Sides',
                    d: 'Any integer between 1 and 2^53-1. Defaults to 6.',
                    optional: true
                },
                {
                    _: 'Count',
                    d: 'Any integer between 1 and 50.',
                    optional: true
                }
            ]
        },
        adminOnly: false,
        enabled: true,
        run: (message, data) => groups.utility.roll(data.arguments)
    },
    {
        group: 'utility',
        regex: {
            command: /(shuffle)/,
            arguments: /\s((([^",\s]+)|("([^"\\]*(?:\\[^,][^"\\]*)*)"))(,\s?)?)+/,
            argumentIndexes: [0]
        },
        description: {
            command: "Shuffles a set of comma-separated values.",
            arguments: [
                {
                    _: 'List',
                    d: 'A list of comma-separated values: Ex: 1, 2, 3, 4',
                    optional: false
                }
            ]
        },
        adminOnly: false,
        enabled: true,
        run: (message, data) => {
            return new Promise((resolve, reject) => {
                require('./app/helpers/shuffle')(data.arguments[0].split(/,\s*/))
                    .then(arr => resolve({ values: arr, content: [arr.join(', ')] }))
                    .catch(e => reject({ rejections: [e], content: [] }));
            });
        }
    },
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
                {
                    _: '@User',
                    d: 'A pinged user.',
                    optional: true
                }
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
        group: 'utility',
        regex: {
            command: /(colorme)|(clrme)/,
            arguments: /\s(.+)/,
            argumentIndexes: [1]
        },
        description: {
            command: "Assigns a user a colored role.",
            arguments: [
                {
                    _: 'Color',
                    d: 'Any color standard color.',
                    optional: false
                }
            ]
        },
        adminOnly: false,
        enabled: true,
        run: (message, data) => groups.utility.colorMe(message, data)
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
    {
        group: 'fetch',
        regex: {
            command: /(findimg)|(img)/,
            arguments: /\s(.+)/,
            argumentIndexes: [1]
        },
        description: {
            command: "Searches for an image.",
            arguments: [
                {
                    _: 'Query',
                    d: 'A provided search term.',
                    optional: false
                }
            ],
            flags: [
                {
                    _: 'r',
                    d: 'Return a random image instead of the first result.'
                },
                {
                    _: 'N',
                    d: 'Allows NSFW results; defaults to moderate only.'
                }
            ]
        },
        adminOnly: false,
        enabled: true,
        run: (message, data) => groups.fetch.findImg(message, data)
    },
    {
        group: 'fetch',
        regex: {
            command: /(find)|(search)/,
            arguments: /\s(.+)/,
            argumentIndexes: [1]
        },
        description: {
            command: "Fetches resuts for a search query.",
            arguments: [
                {
                    _: 'Query',
                    d: 'A provided search term.',
                    optional: false
                }
            ],
            flags: [
                {
                    _: 'r',
                    d: 'Return a random image instead of the first result.'
                },
                {
                    _: 'N',
                    d: 'Allows NSFW results; defaults to moderate only.'
                }
            ]
        },
        adminOnly: false,
        enabled: true,
        run: (message, data) => groups.fetch.find(message, data)
    },
    {
        group: 'games',
        regex: {
            command: /(inv)|(inventory)/,
            arguments: /\s(.+)/,
            argumentIndexes: [1],
            argsOptional: true
        },
        description: {
            command: "Display your inventory.",
            arguments: [
                {
                    _: 'Filter',
                    d: 'A provided filter term.',
                    optional: true
                }
            ],
            flags: []
        },
        adminOnly: false,
        enabled: true,
        run: (message, data) => groups.games.inventory.list(message.author.id, data.arguments[0] || null)
    },
    {
        group: 'games',
        regex: {
            command: /(cast)/,
            arguments: null,
            argumentIndexes: []
        },
        description: {
            command: "Cast your rod into the depths. Maybe something will bite?",
            arguments: [],
            flags: []
        },
        adminOnly: false,
        enabled: true,
        run: (message, data) => groups.games.fishing.cast(message.author.id)
    },
    {
        group: 'games',
        regex: {
            command: /(give)/,
            arguments: null,
            argumentIndexes: []
        },
        description: {
            command: "Gives an item.",
            arguments: [],
            flags: []
        },
        adminOnly: false,
        enabled: true,
        run: (message, data) => {
            return new Promise((resolve, reject) => {
                require('./app/helpers/playerdata').data.inventory.give(message.author.id, {name: "test_item"}, 'item', 1)
                    .then(r => resolve({content: ['Done']}))
                    .catch(err => reject({content: [err.message]}));
            });
        }
    },
    {
        group: 'games',
        regex: {
            command: /(pf_rs)/,
            arguments: null,
            argumentIndexes: []
        },
        description: {
            command: "Reset your profile data.",
            arguments: [],
            flags: []
        },
        adminOnly: false,
        enabled: true,
        run: (message, data) => {
            return new Promise((resolve, reject) => {
                require('./app/helpers/playerdata/profile').newFile(message.author.id)
                    .then(r => resolve({content: ['Done']}))
                    .catch(err => reject({content: [err.message]}));
            });
        }
    },
    {
        group: 'games',
        regex: {
            command: /(save)/,
            arguments: null,
            argumentIndexes: []
        },
        description: {
            command: "Save profile data.",
            arguments: [],
            flags: []
        },
        adminOnly: false,
        enabled: true,
        run: (message, data) => {
            return new Promise((resolve, reject) => {
                require('./app/helpers/playerdata/profile').save();
                resolve({content: ['Done']});
            });
        }
    },
    {
        group: 'crypto',
        regex: {
            command: /(crypto)/,
            arguments: /\s([a-zA-Z]+)/,
            argumentIndexes: [1]
        },
        description: {
            command: "Get coin stats.",
            arguments: [{
                _: 'Coin name.',
                d: 'The coin name, such as BTC or DOGE.',
                optional: false
            }],
            flags: []
        },
        adminOnly: false,
        enabled: true,
        run: (message, data) => groups.misc.crypto.any(data.arguments[0].toUpperCase(), data.arguments[0].toUpperCase())
    },
    {
        group: 'crypto',
        regex: {
            command: /(doge)|(dogecoin)/,
            arguments: null,
            argumentIndexes: []
        },
        description: {
            command: "Get DOGE stats.",
            arguments: [],
            flags: []
        },
        adminOnly: false,
        enabled: true,
        run: (message, data) => groups.misc.crypto.doge(message, data)
    },
    {
        group: 'crypto',
        regex: {
            command: /(btc)|(bitcoin)/,
            arguments: null,
            argumentIndexes: []
        },
        description: {
            command: "Get BTC stats.",
            arguments: [],
            flags: []
        },
        adminOnly: false,
        enabled: true,
        run: (message, data) => groups.misc.crypto.btc(message, data)
    },
    { // Faction commands that have 1 subcommand.
        group: 'factions',
        regex: {
            command: /(faction)|(fc)/,
            arguments: /(\s(\w+))/,
            subcommand: /(create)|(delete)|(about)/,
            argumentIndexes: [2],
            subcommandIndexes: [1, 2, 3]
        },
        description: {
            command: "Faction commands using one subcommand.",
            arguments: [
                {
                    _: '...',
                    d: 'Use "~fc help" or "~fc ?" for faction help.',
                    optional: true
                }
            ]
        },
        adminOnly: false,
        enabled: true,
        run: (message, data) => groups.factions(message, data)
    },
    { // Faction commands that have 1 subcommand, the faction name, and 1 argument.
        group: 'factions',
        regex: {
            command: /(faction)|(fc)/,
            arguments: /(\s(\w+)\s(.+))/,
            subcommand: /(setcolor)/,
            argumentIndexes: [2, 3],
            subcommandIndexes: [1]
        },
        description: {
            command: "Faction commands using one subcommand.",
            arguments: [
                {
                    _: '...',
                    d: 'Use "~fc help" or "~fc ?" for faction help.',
                    optional: true
                }
            ]
        },
        adminOnly: false,
        enabled: true,
        run: (message, data) => groups.factions(message, data)
    },
    { // Faction commands that have 1 subcommand and optional arguments.
        group: 'factions',
        regex: {
            command: /(faction)|(fc)/,
            arguments: /(\s(\w+))/,
            subcommand: /(list)/,
            argumentIndexes: [2],
            subcommandIndexes: [1],
            argsOptional: true
        },
        description: {
            command: "Faction commands using one subcommand with optional arguments.",
            arguments: [
                {
                    _: '...',
                    d: 'Use "~fc help" or "~fc ?" for faction help.',
                    optional: true
                }
            ]
        },
        adminOnly: false,
        enabled: true,
        run: (message, data) => groups.factions(message, data)
    },
];

module.exports = list;