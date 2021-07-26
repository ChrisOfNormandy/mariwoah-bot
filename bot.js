const Discord = require('discord.js');

const parser = require('./src/parser');
const aws = require('./src/aws/aws-link');

const chatFilter = require('./src/app/helpers/chatFilter');
const nameFilter = require('./src/app/helpers/nameFilter');

const aws_helpers = require('./src/aws/helpers/adapter');

const logChannel = "748961589910175805";
const enableNameFilter = false;

const clientConfig = require('./config/config.json');

const playerdata = require('./src/app/groups/games/features/players/playerdata');

const logging = require('./src/app/objects/helpers/logging');

function startup() {
    const client = new Discord.Client();
    client.login(clientConfig.auth.token);

    client.on('ready', () => {
        console.log(`Bot has started, with ${client.users.cache.size} users, in ${client.channels.cache.size} channels of ${client.guilds.cache.size} guilds.`);
        client.user.setActivity(`chat. | ~? | ~help`, { type: 'WATCHING' });

        aws.login()
            .then(res => {
                console.log(`Logged in to AWS using:`, res.credentials.accessKeyId);

                aws_helpers.s3.setup(res.aws);

                playerdata.profile.save();
            })
            .catch(err => {
                console.error(err);
                console.log('Could not log in to AWS.');
            });
    });

    if (enableNameFilter) {
        client.on('guildMemberAdd', member => {
            nameFilter(member)
                .catch(err => console.error(err));
        });

        client.on('guildMemberUpdate', (oldMember, newMember) => {
            if (
                (oldMember.user.username !== newMember.user.username) ||
                (newMember.nickname !== null && oldMember.nickname !== newMember.nickname)
            ) {
                oldMember.guild.channels.cache.get(logChannel).send(
                    `${oldMember.user.username}${oldMember.nickname !== null ? `, nickname ${oldMember.nickname}, ` : ''} updated their name.\n` +
                    `Current: <@${newMember.user.id}>${newMember.nickname === null ? '' : `, nickname ${newMember.nickname}`}.`
                );

                nameFilter(newMember, true, oldMember.user.username !== newMember.user.username)
                    .then(pass => {
                        if (!pass) {
                            if (oldMember.nickname !== newMember.nickname) {
                                if (newMember.nickname === null)
                                    oldMember.guild.channels.get(logChannel).send(`${oldMember.user.username} removed their nickname.`);
                                else
                                    oldMember.guild.channels.get(logChannel).send(`${oldMember.user.username} changed their nickname to ${newMember.nickname}`);
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
            chatFilter(message)
                .then(pass => {
                    if (pass)
                        parser(client, message)
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
    });

    return client;
}

const client = startup();

module.exports = client;