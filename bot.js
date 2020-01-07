const common = require('./src/app/common/core');
const commandParser = require('./src/commandParser');
const joinAlertSound = require('./src/app/common/bot/helpers/joinAlerts/joinAlertSound');

const client = common.client;

client.on('ready', () => {
    console.log(`Bot has started, with ${client.users.size} users, in ${client.channels.size} channels of ${client.guilds.size} guilds.`);

    common.bot.startup();
    common.log('Ready!');
    console.log('Using stats:');
    console.log(common.minigames.stats);

    client.user.setActivity('you. ;)', { type: 'watching' })
});

client.on('message', async message => {
    if (message.author.id == '159985870458322944')
        message.channel.send('FUCK OFF MEE6, YOU STUPID BITCH :dagger: :knife: :fire:');

        //common.bot.reactions(message);

    if (!common.config.settings.prefix.includes(message.content.charAt(0)) || message.author.bot) return;

    commandParser(message);
});

client.on('voiceStateUpdate', (oldMember, newMember) => {
    joinAlertSound(client, oldMember, newMember);
})

client.login(client.token);

