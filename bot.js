const parser = require('./src/parser');
const aws = require('./src/aws/aws-link');

function startup() {
    const Discord = require('discord.js');
    const client = new Discord.Client();
    client.login(require('./config/config.json').auth.token);

    client.on('ready', () => {
        console.log(`Bot has started, with ${client.users.cache.size} users, in ${client.channels.cache.size} channels of ${client.guilds.cache.size} guilds.`);
        client.user.setActivity(`${client.guilds.cache.size} guilds.`, {type: 'WATCHING'});

        aws.login()
            .then(res => {
                console.log(`Logged in to AWS using:`, res.credentials.accessKeyId);

                const aws_helpers = require('./src/aws/helpers/adapter');
                aws_helpers.s3.setup(res.aws);

                // Game profile save loop;

                require('./src/app/helpers/playerdata').profile.save();
            })
            .catch(err => {
                console.error(err);
                console.log('Could not log in to AWS.');
            });
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