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
                d: 'The coin name, such as BTC or DOGE.',
                optional: false
            }],
            flags: []
        },
        adminOnly: false,
        enabled: true,
        run: (message, data) => groups.misc.crypto.any(data.arguments[0].toUpperCase(), data.arguments[0].toUpperCase())
    },
    {
        group: 'crypto',
        regex: {
            command: /(doge)|(dogecoin)/,
            arguments: null,
            argumentIndexes: []
        },
        description: {
            command: "Get DOGE stats.",
            arguments: [],
            flags: []
        },
        adminOnly: false,
        enabled: true,
        run: (message, data) => groups.misc.crypto.doge(message, data)
    },
    {
        group: 'crypto',
        regex: {
            command: /(btc)|(bitcoin)/,
            arguments: null,
            argumentIndexes: []
        },
        description: {
            command: "Get BTC stats.",
            arguments: [],
            flags: []
        },
        adminOnly: false,
        enabled: true,
        run: (message, data) => groups.misc.crypto.btc(message, data)
    },
]

module.exports = {
    crypto
}