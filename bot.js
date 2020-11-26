const adapter = require('./src/app/adapter');
const commandParser = require('./src/parser/main');
// const commandLine = require('./private/commandLine');

const client = adapter.common.bot.global.startup.run();

const watchcat = require('./src/app/watchcat/server');

client.on('ready', () => {
    console.log(`Bot has started, with ${client.users.cache.size} users, in ${client.channels.cache.size} channels of ${client.guilds.cache.size} guilds.`);

    // commandLine.query();

    // client.user.setActivity(`${client.users.cache.size} epic gamers.`, {type: 'WATCHING'});
    client.user.setActivity(`only voice channels, apparently.`, {type: 'WATCHING'});

    watchcat.startup();
});

client.on('message', async message => {
    if (!message.author.bot)
        commandParser(client, message)
            .catch(e => {
                if (e !== null)
                    console.log(e);
            });
});

client.on('messageReactionAdd', (reaction, user) => {
    if (!user.bot) {
        if (reaction.message.author.bot) {
            adapter.rolemanagement.reactRole.onEvent(reaction, user)
                .then(r => console.log(r))
                .catch(e => console.log(e));
        }
    }
});