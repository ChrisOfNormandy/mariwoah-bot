const {Intents, Client} = require('discord.js');

const parser = require('./parser');
const aws = require('../aws/aws-link');

const logging = require('./objects/helpers/logging');

const { byTimestamp } = require('./helpers/getAge');

/**
 * 
 * @param {*} clientConfig 
 * @param {Intents[]} intents
 * @param {boolean} devEnabled 
 * @returns {Promise<{bot: Discord.Client, AWS: AWS}>}
 */
function startup(clientConfig, intents, devEnabled = false) {
    const client = new Client({ intents });
    client.login(clientConfig.auth.token);

    const prefix = clientConfig.settings.commands.prefix || '/';

    return new Promise((resolve, reject) => {
        client.on('messageCreate', (message) => {
            if (!message.author.bot) {
                let start = Date.now();

                parser(client, message, prefix, devEnabled)
                    .then(response => {
                        let end = Date.now();

                        if (clientConfig.settings.dev.enabled) {
                            console.log(byTimestamp(start, end));
                            console.log(response);
                        }
                    })
                    .catch(err => {
                        if (err !== null)
                            logging.error(err, message.content);
                    });
            }
        });

        client.on('ready', () => {
            console.log(`Bot has started, with ${client.users.cache.size} users, in ${client.channels.cache.size} channels of ${client.guilds.cache.size} guilds.`);
            client.user.setActivity(`chat. | ~? | ~help`, { type: 'WATCHING' });

            aws.login(clientConfig.auth.aws)
                .then(res => {
                    console.log(`Logged in to AWS using:`, res.credentials.accessKeyId);

                    resolve({ AWS: res.AWS, bot: client });
                })
                .catch(err => {
                    console.error(err);
                    console.log('Could not log in to AWS.');

                    resolve({ aws: null, bot: client });
                });
        });
    });
}

module.exports = {
    startup
};