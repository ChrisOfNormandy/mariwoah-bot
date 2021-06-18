const groups = require('../../groups');

const list = [
    { // Faction commands that have 1 subcommand.
        group: 'factions',
        regex: {
            command: /(faction)|(fc)/
        },
        subcommands: [
            {
                name: "about",
                regex: {
                    arguments: /\s(\w+)/,
                    argumentIndexes: [1]
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
                run: (message, data) => groups.factions.about(message, data)
            },
            {
                name: "create",
                regex: {
                    arguments: /\s(\w+)/,
                    argumentIndexes: [1]
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
                run: (message, data) => groups.factions.create(message, data)
            },
            {
                name: "list",
                regex: {
                    arguments: null
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
                run: (message, data) => groups.factions.list(message, data)
            },
            {
                name: "remove",
                regex: {
                    arguments: /\s(\w+)/,
                    argumentIndexes: [1]
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
                run: (message, data) => groups.factions.remove(message, data)
            },
            {
                name: "setcolor",
                regex: {
                    arguments: /\s(\w+)\s(#[0-9a-f]{6})/,
                    argumentIndexes: [1, 2]
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
                run: (message, data) => groups.factions.setColor(message, data)
            },
            {
                name: "seticon",
                regex: {
                    arguments: /\s(\w+)\s(<URL:0>)/,
                    argumentIndexes: [1, 2]
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
                run: (message, data) => groups.factions.setIcon(message, data)
            }
        ],
        adminOnly: false,
        enabled: true,
        run: (message, data) => {
            let arr = list[0].subcommands.filter((cmd) => { return cmd.name == data.subcommand});
            if (!!arr.length)
                return arr[0].run(message, data);
            return Promise.reject({content: ['Subcommand not found.']}); // This should never happen if commands are set up correctly, but just in case.
        }
    }
]

module.exports = list;