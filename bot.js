const commandParser = require('./src/commandParser');
const common = require('./src/app/common/core');

const client = common.client;

client.on('ready', () => {
    console.log(`Bot has started, with ${client.users.size} users, in ${client.channels.size} channels of ${client.guilds.size} guilds.`);

    common.bot.init();
    common.log('Ready!');

    client.user.setActivity(`you | ${client.users.size} so far.`, { type: 'watching' });
});

client.on('message', async message => {
    if (message.author.id == '159985870458322944')
        try {
            message.delete(5000);
        }
        catch (e) {
            message.channel.send('I require admin permissions to operate correctly.');
        }
    if (message.author.bot)
        return;

    commandParser(message)
        .then(() => { })
        .catch(err => {
            if (err !== null) {
                common.log(err);
            }
        });
});

client.login(client.token);

