const groups = require('../../groups');

module.exports = [
    { // Faction commands that have 1 subcommand.
        group: 'factions',
        regex: {
            command: /(faction)|(fc)/,
            arguments: /(\s(\w+))/,
            subcommand: /(create)|(delete)|(about)|(remove)/,
            argumentIndexes: [2],
            subcommandIndexes: [1, 2, 3, 4]
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
            subcommand: /(setcolor)|(seticon)/,
            argumentIndexes: [2, 3],
            subcommandIndexes: [1, 2]
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
]