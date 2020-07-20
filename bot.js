const adapter = require('./src/app/adapter');
const commandParser = require('./src/commandParser');

const client = adapter.common.bot.global.startup();

client.on('ready', () => {
    console.log(`Bot has started, with ${client.users.size} users, in ${client.channels.size} channels of ${client.guilds.size} guilds.`);

    adapter.common.bot.features.printLog('Ready!');

    client.user.setActivity(`you | ${client.users.size} so far.`, { type: 'watching' });
});

client.on('message', async message => {
    if (!message.author.bot)
        commandParser(client, message)
            .catch(e => {
                if (e !== null)
                    adapter.common.bot.features.printLog(e);
            });
});
