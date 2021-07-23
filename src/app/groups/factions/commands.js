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
                    command: "Gathers information about a faction, such as its leader and members.",
                    arguments: [
                        {
                            _: 'Name',
                            d: 'The name of a faction.',
                            optional: false
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
                    command: "Creates a new faction.",
                    arguments: [
                        {
                            _: 'Name',
                            d: 'The name of a faction.',
                            optional: false
                        }
                    ]
                },
                adminOnly: false,
                enabled: true,
                run: (message, data) => groups.factions.create(message, data)
            },
            {
                name: "list",
                regex: {},
                description: {
                    command: "Lists all factions in the server.",
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
                    command: "Deletes a faction from the server.",
                    arguments: [
                        {
                            _: 'Name',
                            d: 'The name of a faction.',
                            optional: false
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
                    command: "Sets the faction color, seen in its `about` page.",
                    arguments: [
                        {
                            _: 'Name',
                            d: 'The name of a faction.',
                            optional: false
                        },
                        {
                            _: 'Color',
                            d: 'A hex color value, like `#ff00ff`.',
                            optional: false
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
                    command: "Sets the faction icon, seen in its `about` page.",
                    arguments: [
                        {
                            _: 'Name',
                            d: 'The name of a faction.',
                            optional: false
                        },
                        {
                            _: 'Image',
                            d: 'An image URL for an icon.',
                            optional: false
                        }
                    ]
                },
                adminOnly: false,
                enabled: true,
                run: (message, data) => groups.factions.setIcon(message, data)
            },
            {
                name: "delete",
                regex: {
                    arguments: /\s(\w+)/,
                    argumentIndexes: [1]
                },
                description: {
                    command: "Deletes a faction.",
                    arguments: [
                        {
                            _: 'Name',
                            d: 'The name of a faction.',
                            optional: false
                        }
                    ]
                },
                adminOnly: false,
                enabled: true,
                run: (message, data) => groups.factions.delete(message, data)
            },
            {
                name: "reset",
                regex: {
                    arguments: /\s(\w+)/,
                    argumentIndexes: [1]
                },
                description: {
                    command: "Resets a faction.",
                    arguments: [
                        {
                            _: 'Name',
                            d: 'The name of a faction.',
                            optional: false
                        }
                    ]
                },
                adminOnly: false,
                enabled: true,
                run: (message, data) => groups.factions.reset(message, data)
            },
            {
                name: "join",
                regex: {
                    arguments: /\s(\w+)/,
                    argumentIndexes: [1]
                },
                description: {
                    command: "Join a faction.",
                    arguments: [
                        {
                            _: 'Name',
                            d: 'The name of a faction.',
                            optional: false
                        }
                    ]
                },
                adminOnly: false,
                enabled: true,
                run: (message, data) => groups.factions.members.join(message, data)
            },
            {
                name: "leave",
                regex: {
                    arguments: /\s(\w+)/,
                    argumentIndexes: [1]
                },
                description: {
                    command: "Leave a faction.",
                    arguments: [
                        {
                            _: 'Name',
                            d: 'The name of a faction.',
                            optional: false
                        }
                    ]
                },
                adminOnly: false,
                enabled: true,
                run: (message, data) => groups.factions.members.leave(message, data)
            },
            {
                name: "checkme",
                regex: {},
                description: {
                    command: "Join a faction."
                },
                adminOnly: false,
                enabled: true,
                run: (message, data) => {
                    return new Promise((resolve, reject) => {
                    groups.factions.cache.members.get(message.guild, message.author.id)
                        .then(r => {
                            console.log(r);
                            resolve({content: ['Yes']});
                        })
                        .catch(err => reject({rejections: [err], content: [err.message]}));
                    });
                }
            },
            {
                name: "addrole",
                regex: {},
                description: {
                    command: "Join a faction."
                },
                adminOnly: false,
                enabled: true,
                run: (message, data) => {
                    return new Promise((resolve, reject) => {
                        groups.factions.members.role.add(message, data)
                            .then(r => {
                                console.log(r);
                                resolve({ content: ['Yes'] });
                            })
                            .catch(err => reject({ rejections: [err], content: [err.message] }));
                    });
                }
            }
        ],
        adminOnly: false,
        enabled: true,
        run: (message, data) => {
            let arr = list[0].subcommands.filter((cmd) => { return cmd.name == data.subcommand; });

            if (!!arr.length)
                return arr[0].run(message, data);

            return Promise.reject({ content: ['Subcommand not found.'] }); // This should never happen if commands are set up correctly, but just in case.
        }
    }
];

module.exports = list;