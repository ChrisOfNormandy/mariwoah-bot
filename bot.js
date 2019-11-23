const common = require('./src/app/common/core');
const commandParser = require('./src/commandParser');

const client = common.client;

client.on('ready', () => {
    console.log(`Bot has started, with ${client.users.size} users, in ${client.channels.size} channels of ${client.guilds.size} guilds.`);

    common.bot.startup();
    common.log('Ready!');
    console.log('Using stats:');
    console.log(common.minigames.stats);
});

client.on('message', async message => {
    if (message.author.id == '159985870458322944') {
        message.channel.send('FUCK OFF MEE6, YOU STUPID BITCH :dagger: :knife: :fire:');
        return;
    }
    if (message.author.bot) return;
    if (!common.config.settings.prefix.includes(message.content.charAt(0))) return;

    commandParser(message);
});

client.login(client.token);