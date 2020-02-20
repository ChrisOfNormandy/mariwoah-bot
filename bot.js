const commandParser = require('./src/commandParser');
const common = require('./src/app/common/core');

const client = common.client;

client.on('ready', () => {
    console.log(`Bot has started, with ${client.users.size} users, in ${client.channels.size} channels of ${client.guilds.size} guilds.`);

    common.bot.startup();
    common.log('Ready!');

    client.user.setActivity('you. ;)', { type: 'watching' })
});

client.on('message', async message => {
    if (message.author.id == '159985870458322944')
        try {
            message.delete(5000)
                .then(async () => message.channel.send('Denied.')
                    .then(m => setTimeout(m.delete, 5000)));
        }
        catch (e) {
            message.channel.send('I require admin permissions to operate correctly.');
        }
    if (!common.config.settings.prefix.includes(message.content.charAt(0)) || message.author.bot)
        return;

    commandParser(message)
        .catch(err => message.channel.send(err || 'Error'));
});

client.login(client.token);

