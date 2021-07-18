const groups = require('../../groups');

const crypto = [
    {
        group: 'crypto',
        regex: {
            command: /(crypto)/,
            arguments: /\s([a-zA-Z]+)/,
            argumentIndexes: [1]
        },
        description: {
            command: "Get coin stats.",
            arguments: [{
                _: 'Coin name.',
                d: 'The coin name, such as BTC, DOGE or ETH.',
                optional: false
            }]
        },
        adminOnly: false,
        enabled: true,
        run: (message, data) => groups.misc.crypto.any(data.arguments[0].toUpperCase(), data.arguments[0].toUpperCase())
    }
];

module.exports = {
    crypto
};