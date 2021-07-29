const { commands, client } = require('@chrisofnormandy/mariwoah-bot');
const config = require('./config/config.json');

const groups = require('./src/commands');

for (let i in groups) {
    let g = commands.addCommandGroup(i);
    groups[i].forEach(command => g.addCommand(command));
}

client.startup(config, config.auth.aws, config.settings.commands.prefix);