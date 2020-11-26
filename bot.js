const adapter = require('./src/app/adapter');
const commandParser = require('./src/parser/main');

const client = adapter.common.bot.global.startup.run();

const watchcat = require('./src/app/watchcat/server');

const readline = require('readline');
const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

function prompt() {
    rl.question("> ", (str) => {
        commandParser.console(str)
            .then(res => {
                console.log(`Resolved: `, res);
                prompt();
            })
            .catch(e => console.log(e));
    });
}

client.on('ready', () => {
    console.log(`Bot has started, with ${client.users.cache.size} users, in ${client.channels.cache.size} channels of ${client.guilds.cache.size} guilds.`);

    // client.user.setActivity(`${client.users.cache.size} epic gamers.`, {type: 'WATCHING'});
    client.user.setActivity(`only voice channels, apparently.`, {type: 'WATCHING'});

    watchcat.startup();

    prompt();
});

client.on('message', async message => {
    if (!message.author.bot)
        commandParser.chat(client, message)
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