const { Command } = require('@chrisofnormandy/mariwoah-bot');

const groups = require('../../groups');

/**
 * @type {Command}
 */
const crypto = [
    new Command(
        'crypto',
        (message, data) => groups.misc.crypto.any(data.arguments[0].toUpperCase(), data.arguments[0].toUpperCase())
    )
        .setRegex(/(crypto)/, /\s([a-zA-Z]+)/, [1])
        .setCommandDescription('Get coin stats.')
        .setArgumentDescription(0, 'Coin name', 'The coin name, such as BTC, DOGE or ETH.')
];

/**
 * @type {Command[]}
 */
module.exports = {
    crypto
};