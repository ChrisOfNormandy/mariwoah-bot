const adapter = require('./src/app/adapter');
const commandParser = require('./src/commandParser');
// const commandLine = require('./private/commandLine');
const debug = require('./debug');

const client = adapter.common.bot.global.startup.run();

client.on('ready', () => {
    console.log(`Bot has started, with ${client.users.cache.size} users, in ${client.channels.cache.size} channels of ${client.guilds.cache.size} guilds.`);

    // commandLine.query();

    client.user.setActivity(`${client.users.cache.size} epic gamers.`, {type: 'WATCHING'});

    debug.run();
});

client.on('message', async message => {
    if (!message.author.bot)
        commandParser(client, message)
            .catch(e => {
                if (e === null) {
                    // No response available. All is good :)
                }
                else 
                    console.log(e);
            });
});