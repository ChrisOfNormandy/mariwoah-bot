const { Command, handlers, Output } = require('@chrisofnormandy/mariwoah-bot');
const { shuffle, divideArray } = handlers.arrays;

const groups = require('../../groups');

/**
 *
 * @param {import('@chrisofnormandy/mariwoah-bot').MessageData} data
 * @returns
 */
function _shuffle(data) {
    const v = shuffle(data.arguments[0].split(/,\s*/g));

    return new Output(v.join(', ')).setValues(v).resolve();
}

/**
 *
 * @param {import('@chrisofnormandy/mariwoah-bot').MessageData} data
 * @returns
 */
function _divide(data) {
    const list = data.arguments[1].split(/,\s*/g);
    const size = Number(data.arguments[0]);

    const v = divideArray(list, size);

    return new Output(v.map((l) => l.join(', ')).join('\n')).setValues(v).resolve();
}

/**
 * @type {Command[]}
 */
module.exports = [
    new Command(
        'utility',
        'clean-chat',
        groups.utility.clean
    )
        .setRegex(/(clean)/, /\s(\d+)/, [1], true)
        .setCommandDescription('Cleans chat of bot messages and commands. Can be used to clean specific user messages.')
        .setArgumentDescription(0, 'Message count', 'How many messages to delete. Max 50 total.', true),
    new Command(
        'utility',
        'roll-dice',
        groups.utility.roll
    )
        .setRegex(/(roll)|(r)|(d)/, /\s?(\d+)?(\s(\d+))?/, [1, 3])
        .setCommandDescription('Rolls a number between 1 and a given value.')
        .setArgumentDescription(0, 'Sides', 'Any integer between 1 and 2^53-1. Defaults to 6.', true)
        .setArgumentDescription(1, 'Count', 'Any integer between 1 and 50', true),
    new Command(
        'utility',
        'shuffle',
        _shuffle
    )
        .setRegex(/(shuffle)/, /\s((([^",\s]+)|("([^"\\]*(?:\\[^,][^"\\]*)*)"))(,\s?)?)+/, [0])
        .setCommandDescription('Shuffles a set of comma-separated values.')
        .setArgumentDescription(0, 'List', 'A list of comma-separated values.'),
    new Command(
        'utility',
        'split',
        _divide
    )
        .setRegex(/(split)/, /\s(\d+)\s((\s*[^\s,],\s*)*[^\s,])/, [1, 2])
        .setCommandDescription('Divides a set of comma-separated values.')
        .setArgumentDescription(0, 'Size', 'How many sections to divide into.')
        .setArgumentDescription(1, 'List', 'A list of comma-separated values.'),
    new Command(
        'utility',
        'color-role',
        groups.utility.colorMe
    )
        .setRegex(/(colorme)|(clrme)/, /\s(.+)/, [1])
        .setCommandDescription('Assigns a user a colored role.')
        .setArgumentDescription(0, 'Color', 'Any standard color.'),
    new Command(
        'utility',
        'vc-roulette',
        groups.utility.vcRoulette
    )
        .setRegex(/(roulette)|(vcr)/)
        .setCommandDescription('Roll and 1 and get disconnected.'),
    new Command(
        'utility',
        'split-vc',
        groups.utility.splitVc
    )
        .setRegex(/(splitvc)|(svc)/, /\s(.+)/, [1])
        .setCommandDescription('Splits the VC into two groups.')
        .setAdminOnly()
];