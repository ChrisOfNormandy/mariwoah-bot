const common = require('./src/app/common/core');
const commandParser = require('./src/commandParser');
const joinAlertSound = require('./src/app/common/bot/helpers/joinAlerts/joinAlertSound');

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
            message.delete()
                .then(async () => message.channel.send('Denied.').then(m => setTimeout(m.delete, 5000)));
        }
        catch (e) {
            message.channel.send('I require admin permissions to operate correctly.');
        }

        //common.bot.reactions(message);

    if (!common.config.settings.prefix.includes(message.content.charAt(0)) || message.author.bot) return;

    commandParser(message)
        .then(result => {
            //if (result) console.log(result);
        })
        .catch(err => console.log(message.content, err));
});

client.on('voiceStateUpdate', (oldMember, newMember) => {
    //joinAlertSound(client, oldMember, newMember);
})

client.login(client.token);

