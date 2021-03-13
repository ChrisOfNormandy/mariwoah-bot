const parser = require('./src/parser');
const aws = require('./src/aws/aws-link');

function startup() {
    const Discord = require('discord.js');
    const client = new Discord.Client();
    client.login(require('./config/config.json').auth.token);

    client.on('ready', () => {
        console.log(`Bot has started, with ${client.users.cache.size} users, in ${client.channels.cache.size} channels of ${client.guilds.cache.size} guilds.`);
        client.user.setActivity(`${client.guilds.cache.size} guilds.`, {type: 'WATCHING'});

        aws.login();
    });
    
    client.on('message', (message) => {
        if (!message.author.bot)
            parser(client, message)
                .catch(err => {
                    if (err !== null) {
                        console.error('ERROR:', err);
                    }
                });
    });

    return client
}

const client = startup();

module.exports = client;
