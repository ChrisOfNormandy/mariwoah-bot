const { Intents } = require('discord.js');
const { Bot } = require('./indexJS');
const config = {
    'settings': {
        'commands': {
            'prefix': '~'
        },
        'dev': {
            'enabled': true
        },
        'logging': {
            'enabled': true,
            'channels': []
        }
    },
    'auth': {
        'token': ''
    }
};

const bot = new Bot(config, [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MESSAGES], {});

bot.startup({ devEnabled: true })
    .catch((err) => console.error(err));