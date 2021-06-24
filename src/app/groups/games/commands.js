const groups = require('../../groups');

module.exports = [
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
            ]
        },
        adminOnly: false,
        enabled: true,
        run: (message, data) => groups.games.inventory.list(message.author.id, data.arguments[0] || null)
    },
    {
        group: 'games',
        regex: {
            command: /(cast)/
        },
        description: {
            command: "Cast your rod into the depths. Maybe something will bite?"
        },
        adminOnly: false,
        enabled: true,
        run: (message, data) => groups.games.fishing.cast(message.author.id)
    },
    {
        group: 'games',
        regex: {
            command: /(give)/
        },
        description: {
            command: "Gives an item."
        },
        adminOnly: false,
        enabled: false,
        run: (message, data) => {
            return new Promise((resolve, reject) => {
                require('./app/helpers/playerdata').data.inventory.give(message.author.id, { name: "test_item" }, 'item', 1)
                    .then(r => resolve({ content: ['Done'] }))
                    .catch(err => reject({ content: [err.message] }));
            });
        }
    },
    {
        group: 'games',
        regex: {
            command: /(pf_rs)/
        },
        description: {
            command: "Reset your profile data."
        },
        adminOnly: false,
        enabled: false,
        run: (message, data) => {
            return new Promise((resolve, reject) => {
                require('./app/helpers/playerdata/profile').newFile(message.author.id)
                    .then(r => resolve({ content: ['Done'] }))
                    .catch(err => reject({ content: [err.message] }));
            });
        }
    },
    {
        group: 'games',
        regex: {
            command: /(save)/
        },
        description: {
            command: "Save profile data."
        },
        adminOnly: false,
        enabled: false,
        run: (message, data) => {
            return new Promise((resolve, reject) => {
                require('./app/helpers/playerdata/profile').save();
                resolve({ content: ['Done'] });
            });
        }
    },
]