const { groups, client } = require('@chrisofnormandy/mariwoah-bot');
const config = require('./config/config.json');

const commands = require('./src/commands');

for (let i in commands) {
    let g = groups.addCommandGroup(i);
    commands[i].forEach(command => g.addCommand(command));
}

client.startup(config, true)
    .then(server => {
        if (config.settings.logging.enabled) {
            config.settings.logging.channels.forEach(log => {
                server.guilds.fetch(log.guild)
                    .then(guild => {
                        if (log.options.onStart)
                            guild.channels.cache.get(log.channel).send(`This bot has been configured to output logging notifications to this channel.\nThis is a startup notice.`);
                    })
                    .catch(err => console.error('Failed to fetch guild.'));
            });
        }
    });