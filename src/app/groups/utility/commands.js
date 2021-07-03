const groups = require('../../groups');

module.exports = [
    {
        group: 'utility',
        regex: {
            command: /(clean)/,
            arguments: /\s(<USER:\d+>)/,
            argumentIndexes: [1],
            argsOptional: true
        },
        description: {
            command: "Cleans chat of bot messages and commands. Can be used to clean specific user messages.",
            arguments: [
                {
                    _: '@User',
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
        group: 'utility',
        regex: {
            command: /(roll)|(r)|(d)/,
            arguments: /(\s?([1-9][0-9]*)?(\s([1-9][0-9]*))?)|(\d+(\s\d+)?)/,
            argumentIndexes: [2, 4, 5, 6]
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
        group: 'utility',
        regex: {
            command: /(getchatfilter)|(cfget)/,
            arguments: /\s(\w+)/,
            argumentIndexes: [1]
        },
        description: {
            command: "Fetches the server chat filter rules for a given filter.",
            arguments: [
                {
                    _: 'Filter rule.',
                    d: 'warned | kicked | banned',
                    optional: false
                }
            ]
        },
        adminOnly: true,
        enabled: true,
        run: (message, data) => groups.utility.chatFilter_get(message, data)
    },
    {
        group: 'utility',
        regex: {
            command: /(addchatfilter)|(cfadd)/,
            arguments: /\s(\w+)\s(.+)/,
            argumentIndexes: [1, 2]
        },
        description: {
            command: "Adds a phrase to a specified chat filter.",
            arguments: [
                {
                    _: 'Filter rule.',
                    d: 'warned | kicked | banned',
                    optional: false
                },
                {
                    _: 'Filter phrase.',
                    d: 'Any banned statement.',
                    optional: false
                }
            ]
        },
        adminOnly: true,
        enabled: true,
        run: (message, data) => groups.utility.chatFilter_add(message, data)
    },
    {
        group: 'utility',
        regex: {
            command: /(removechatfilter)|(cfremove)|(cfrm)/,
            arguments: /\s(\w+)\s(.+)/,
            argumentIndexes: [1, 2]
        },
        description: {
            command: "Removes a phrase from a specified chat filter.",
            arguments: [
                {
                    _: 'Filter rule.',
                    d: 'warned | kicked | banned',
                    optional: false
                },
                {
                    _: 'Filter phrase.',
                    d: 'Any banned statement.',
                    optional: false
                }
            ]
        },
        adminOnly: true,
        enabled: true,
        run: (message, data) => groups.utility.chatFilter_remove(message, data)
    },
    {
        group: 'utility',
        regex: {
            command: /(clearchatfilter)|(cfclear)/,
            arguments: /\s(\w+)/,
            argumentIndexes: [1]
        },
        description: {
            command: "Clears a specified chat filter.",
            arguments: [
                {
                    _: 'Filter rule.',
                    d: 'warned | kicked | banned',
                    optional: false
                }
            ]
        },
        adminOnly: true,
        enabled: true,
        run: (message, data) => groups.utility.chatFilter_clear(message, data)
    },
    {
        group: 'utility',
        regex: {
            command: /(getnamefilter)|(nfget)/,
            arguments: /\s(\w+)/,
            argumentIndexes: [1]
        },
        description: {
            command: "Fetches the server name filter rules for a given filter.",
            arguments: [
                {
                    _: 'Filter rule.',
                    d: 'warned | kicked | banned',
                    optional: false
                }
            ]
        },
        adminOnly: true,
        enabled: true,
        run: (message, data) => groups.utility.nameFilter_get(message, data)
    },
    {
        group: 'utility',
        regex: {
            command: /(addnamefilter)|(nfadd)/,
            arguments: /\s(\w+)\s(.+)/,
            argumentIndexes: [1, 2]
        },
        description: {
            command: "Adds a phrase to a specified name filter.",
            arguments: [
                {
                    _: 'Filter rule.',
                    d: 'warned | kicked | banned',
                    optional: false
                },
                {
                    _: 'Filter phrase.',
                    d: 'Any banned statement.',
                    optional: false
                }
            ]
        },
        adminOnly: true,
        enabled: true,
        run: (message, data) => groups.utility.nameFilter_add(message, data)
    },
    {
        group: 'utility',
        regex: {
            command: /(removenamefilter)|(nfremove)|(nfrm)/,
            arguments: /\s(\w+)\s(.+)/,
            argumentIndexes: [1, 2]
        },
        description: {
            command: "Removes a phrase from a specified name filter.",
            arguments: [
                {
                    _: 'Filter rule.',
                    d: 'warned | kicked | banned',
                    optional: false
                },
                {
                    _: 'Filter phrase.',
                    d: 'Any banned statement.',
                    optional: false
                }
            ]
        },
        adminOnly: true,
        enabled: true,
        run: (message, data) => groups.utility.nameFilter_remove(message, data)
    },
    {
        group: 'utility',
        regex: {
            command: /(clearnamefilter)|(nfclear)/,
            arguments: /\s(\w+)/,
            argumentIndexes: [1]
        },
        description: {
            command: "Clears a specified name filter.",
            arguments: [
                {
                    _: 'Filter rule.',
                    d: 'warned | kicked | banned',
                    optional: false
                }
            ]
        },
        adminOnly: true,
        enabled: true,
        run: (message, data) => groups.utility.nameFilter_clear(message, data)
    },
    {
        group: 'utility',
        regex: {
            command: /(roulette)|(vcr)/
        },
        description: {
            command: "Roll and 1 and get disconnected."
        },
        adminOnly: false,
        enabled: true,
        run: (message, data) => groups.utility.vcRoulette(message)
    },
]