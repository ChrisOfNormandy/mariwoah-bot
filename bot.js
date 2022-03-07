const { Intents } = require('discord.js');
const { Bot } = require('@chrisofnormandy/mariwoah-bot');
const config = require('./config/config.json');

const commands = require('./src/commands');

console.log(commands);

const bot = new Bot(config, [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MESSAGES], commands);
bot.setStatus('%guild_count% servers | %prefix%?');

bot.startup({ devEnabled: true })
    .catch((err) => console.error(err));