const Discord = require('discord.js');

const parser = require('./parser');
const aws = require('../aws/aws-link');

const chatFilter = require('./helpers/chatFilter');
const nameFilter = require('./helpers/nameFilter');

const aws_helpers = require('../aws/helpers/adapter');

const logging = require('./objects/helpers/logging');

const { byTimestamp } = require('./helpers/getAge');

/**
 * 
 * @param {*} clientConfig 
 * @param {boolean} devEnabled 
 * @returns {Promise<Discord.Client>}
 */
function startup(clientConfig, devEnabled = false) {
    const client = new Discord.Client();
    client.login(clientConfig.auth.token);

    const prefix = clientConfig.settings.commands.prefix || '/';

    if (clientConfig.settings.filters.name.enabled) {
        client.on('guildMemberAdd', member => {
            nameFilter(clientConfig.settings.aws.s3.bucket, member)
                .catch(err => console.error(err));
        });

        client.on('guildMemberUpdate', (oldMember, newMember) => {
            if (
                (oldMember.user.username !== newMember.user.username) ||
                (newMember.nickname !== null && oldMember.nickname !== newMember.nickname)
            ) {
                clientConfig.settings.logging.channels.forEach(logChannel => {
                    try {
                        oldMember.guild.channels.cache.get(logChannel.channel).send(
                            `${oldMember.user.username}${oldMember.nickname !== null ? `, nickname ${oldMember.nickname}, ` : ''} updated their name.\n` +
                            `Current: <@${newMember.user.id}>${newMember.nickname === null ? '' : `, nickname ${newMember.nickname}`}.`
                        );
                    }
                    catch (err) {
                        console.error(err);
                    }
                });

                nameFilter(clientConfig.settings.aws.s3.bucket, newMember, true, oldMember.user.username !== newMember.user.username)
                    .then(pass => {
                        if (!pass) {
                            if (oldMember.nickname !== newMember.nickname) {
                                try {
                                    clientConfig.settings.logging.channels.forEach(logChannel => {
                                        if (newMember.nickname === null)
                                            oldMember.guild.channels.get(logChannel.channel).send(`${oldMember.user.username} removed their nickname.`);
                                        else
                                            oldMember.guild.channels.get(logChannel.channel).send(`${oldMember.user.username} changed their nickname to ${newMember.nickname}`);
                                    });
                                }
                                catch (err) {
                                    console.error(err);
                                }
                            }
                        }
                    })
                    .catch(err => console.error(err));
            }
        });

        // client.on('guildMemberRemove', member => {
        //     // Do something
        // });
    }

    client.on('message', (message) => {
        if (!message.author.bot) {
            let start = Date.now();

            if (clientConfig.settings.filters.chat.enabled) {
                chatFilter(clientConfig.settings.aws.s3.bucket, message)
                    .then(pass => {
                        if (pass)
                            parser(client, message, prefix, devEnabled)
                                .then(response => {
                                    let end = Date.now();
                                    if (clientConfig.settings.dev.enabled)
                                        console.log(byTimestamp(start, end));
                                })
                                .catch(err => {
                                    if (err !== null)
                                        logging.error(err, message.content);
                                });
                        else {
                            message.delete()
                                .catch(err => message.channel.send(err.message));
                        }
                    })
                    .catch(err => console.error(err));
            }
            else {
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
        }
    });

    return new Promise((resolve, reject) => {
        client.on('ready', () => {
            console.log(`Bot has started, with ${client.users.cache.size} users, in ${client.channels.cache.size} channels of ${client.guilds.cache.size} guilds.`);
            client.user.setActivity(`chat. | ~? | ~help`, { type: 'WATCHING' });

            aws.login(clientConfig.auth.aws)
                .then(res => {
                    console.log(`Logged in to AWS using:`, res.credentials.accessKeyId);

                    aws_helpers.s3.setup(res.aws);
                })
                .catch(err => {
                    console.error(err);
                    console.log('Could not log in to AWS.');
                });

            resolve(client);
        });
    });
}

module.exports = {
    startup
};