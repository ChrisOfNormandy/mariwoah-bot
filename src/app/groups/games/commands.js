const { Command, Output } = require('@chrisofnormandy/mariwoah-bot');

const groups = require('../../groups');

/**
 * @type {Command[]}
 */
module.exports = [
    new Command(
        'games',
        (message, data) => groups.games.inventory.list(message.author.id, data.arguments[0] || null)
    )
        .setRegex(/(inv)|(inventory)/, /\s(.+)/, [1], true)
        .setCommandDescription("Display your inventory.")
        .setArgumentDescription(0, "Filter", 'A provided filter term.', true),
    new Command(
        'games',
        (message, data) => groups.games.players.stats(message, data)
    )
        .setRegex(/stats/, /\s(<USER:\d>)/, [1], true)
        .setCommandDescription('Display your inventory.')
        .setArgumentDescription(0, 'Filter', 'A provided filter term.', true),
    new Command(
        'games',
        (message, data) => groups.games.fishing.cast(message.author.id)
    )
        .setRegex(/(cast)/)
        .setCommandDescription('Cast your rod into the depths. Maybe something will bite?'),
    new Command(
        'games',
        (message, data) => {
            return new Promise((resolve, reject) => {
                require('./app/helpers/playerdata').data.inventory.give(message.author.id, { name: "test_item" }, 'item', 1)
                    .then(r => resolve(new Output('Done').setValues(r)))
                    .catch(err => reject(new Output().setError(err)));
            });
        }
    )
        .setRegex(/(give)/)
        .setCommandDescription('Gives an item.'),
    new Command(
        'games',
        (message, data) => {
            return new Promise((resolve, reject) => {
                require('../games/features/players/playerdata').profile.newFile(message.author.id)
                    .then(r => resolve(new Output('Done').setValues(r)))
                    .catch(err => reject(new Output().setError(err)));
            });
        }
    )
        .setRegex(/(pf_rs)/)
        .setCommandDescription('Reset your profile data.'),
    new Command(
        'games',
        (message, data) => {
            return new Promise((resolve, reject) => {
                require('../games/features/players/playerdata').profile.save();
                resolve(new Output('Done').setValues(r));
            });
        }
    )
        .setRegex(/(save)/)
        .setCommandDescription('Save profile data.')
];