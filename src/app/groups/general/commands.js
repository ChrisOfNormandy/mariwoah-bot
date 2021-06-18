const groups = require('../../groups');

module.exports = [
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
];
