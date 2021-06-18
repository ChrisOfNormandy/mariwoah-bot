const groups = require('../../groups');

module.exports = [
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
]