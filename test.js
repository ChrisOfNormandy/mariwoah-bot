const { Intents } = require('discord.js');
const { groups, Bot } = require('./indexJS');
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

const commands = {};

const bot = new Bot();

bot.startup(config, [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MESSAGES], { devEnabled: true })
    .then((res) => {
        for (let i in commands)
            commands[i].forEach((command) => groups.addCommandGroup(i).addCommand(command));

        if (config.settings.logging.enabled) {
            config.settings.logging.channels.forEach((log) => {
                res.bot.guilds.fetch(log.guild)
                    .then((guild) => {
                        if (log.options.onStart)
                            guild.channels.cache
                                .get(log.channel)
                                .send('This bot has been configured to output logging notifications to this channel.\nThis is a startup notice.');
                    })
                    .catch((err) => console.error('Failed to fetch guild.', err));
            });
        }
    })
    .catch((err) => console.error(err));