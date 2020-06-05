const adapter = require('./src/app/adapter');
const commandParser = require('./src/commandParser');
const commandLine = require('./private/commandLine');

const client = adapter.common.bot.global.startup.run();

client.on('ready', () => {
    console.log(`Bot has started, with ${client.users.cache.size} users, in ${client.channels.cache.size} channels of ${client.guilds.cache.size} guilds.`);

    adapter.common.bot.features.printLog('Ready!');
    commandLine.query();

    client.user.setActivity(`you | ${client.users.cache.size} so far.`, { type: 'watching' });
});

client.on('message', async message => {
    if (!message.author.bot)
        commandParser(client, message)
            .catch(e => {
                if (e !== null)
                    adapter.common.bot.features.printLog(e);
            });
});
