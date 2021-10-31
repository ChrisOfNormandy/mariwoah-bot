const { Command } = require('@chrisofnormandy/mariwoah-bot');

const groups = require('../../groups');

function shuffle(message, data) {
    return new Promise((resolve, reject) => {
        require('./app/helpers/shuffle')(data.arguments[0].split(/,\s*/))
            .then(arr => resolve({ values: arr, content: [arr.join(', ')] }))
            .catch(e => reject({ rejections: [e], content: [] }));
    });
}

/**
 * @type {Command[]}
 */
module.exports = [
    new Command(
        'utility',
        (message, data) => groups.utility.clean(message, data)
    )
        .setRegex(/(clean)/, /\s(\d+)/, [1], true)
        .setCommandDescription('Cleans chat of bot messages and commands. Can be used to clean specific user messages.')
        .setArgumentDescription(0, 'Message count', 'How many messages to delete. Max 50 total.', true),
    new Command(
        'utility',
        (message, data) => groups.utility.roll(data)
    )
        .setRegex(/(roll)|(r)|(d)/, /\s?(\d+)?(\s(\d+))?/, [1, 3])
        .setCommandDescription('Rolls a number between 1 and a given value.')
        .setArgumentDescription(0, 'Sides', 'Any integer between 1 and 2^53-1. Defaults to 6.', true)
        .setArgumentDescription(1, 'Count', 'Any integer between 1 and 50', true),
    new Command(
        'utility',
        (message, data) => shuffle(message, data)
    )
        .setRegex(/(shuffle)/, /\s((([^",\s]+)|("([^"\\]*(?:\\[^,][^"\\]*)*)"))(,\s?)?)+/, [0])
        .setCommandDescription('Shuffles a set of comma-separated values.')
        .setArgumentDescription(0, 'List', 'A list of comma-separated values.'),
    new Command(
        'utility',
        (message, data) => groups.utility.colorMe(message, data)
    )
        .setRegex(/(colorme)|(clrme)/, /\s(.+)/, [1])
        .setCommandDescription('Assigns a user a colored role.')
        .setArgumentDescription(0, 'Color', 'Any standard color.'),
    new Command(
        'utility',
        (message, data) => groups.utility.vcRoulette(message)
    )
        .setRegex(/(roulette)|(vcr)/)
        .setCommandDescription('Roll and 1 and get disconnected.'),
    new Command(
        'utility',
        (message, data) => groups.utility.splitVc(message, data)
    )
        .setRegex(/(splitvc)|(svc)/, /\s(.+)/, [1])
        .setCommandDescription('Splits the VC into two groups.')
        .setAdminOnly()
];