const commands = require('./src/commands');
const config = require('./config/config.json');

const { Intents } = require('discord.js');
const { Bot } = require('@chrisofnormandy/mariwoah-bot');

const bot = new Bot(
    config,
    [
        Intents.FLAGS.GUILDS,
        Intents.FLAGS.GUILD_MESSAGES,
        Intents.FLAGS.GUILD_VOICE_STATES
    ],
    commands
);
bot.setStatus('%guild_count% servers | %prefix%?');

bot.startup({ devEnabled: true, databaseTables: require('./config/tables.json'), resetDatabase: true })
    .catch((err) => console.error(err));