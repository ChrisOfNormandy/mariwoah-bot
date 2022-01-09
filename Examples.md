# `config.json`
```json
{
    "settings": {
        "commands": {
            "prefix": "~"
        },
        "dev": {
            "enabled": true
        },
        "logging": {
            "enabled": true,
            "channels": [
                {
                    "guild": "012345678912345678",
                    "channel": "012345678912345678",
                    "options": {
                        "onStart": true
                    }
                }
            ]
        },
        "filters": {
            "chat": {
                "enabled": true,
                "bypassRoles": [
                    "trusted"
                ]
            },
            "name": {
                "enabled": false
            }
        }
    },
    "auth": {
        "token": "<Your Discord bot token>",
    }
}
```

# `bot.js`
```js
const { groups, client } = require('@chrisofnormandy/mariwoah-bot');
const config = require('./config/config.json');

client.startup(config, true)
    .then(res => {
        const commands = require('./src/commands');

        for (let i in commands)
            commands[i].forEach(command => groups.addCommandGroup(i).addCommand(command));

        if (config.settings.logging.enabled) {
            config.settings.logging.channels.forEach(log => {
                res.bot.guilds.fetch(log.guild)
                    .then(guild => {
                        if (log.options.onStart)
                            guild.channels.cache
                                .get(log.channel)
                                .send(`This bot has been configured to output logging notifications to this channel.\nThis is a startup notice.`);
                    })
                    .catch(err => console.error('Failed to fetch guild.'));
            });
        }
    })
    .catch(err => console.error('Failed to start.'));
```