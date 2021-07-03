const parser = require('./src/parser');
const aws = require('./src/aws/aws-link');

const chatFilter = require('./src/app/helpers/chatFilter');
const nameFilter = require('./src/app/helpers/nameFilter');

const aws_helpers = require('./src/aws/helpers/adapter');

const logChannel = "748961589910175805";
const enableNameFilter = false;

function startup() {
    const Discord = require('discord.js');
    const client = new Discord.Client();
    client.login(require('./config/config.json').auth.token);

    client.on('ready', () => {
        console.log(`Bot has started, with ${client.users.cache.size} users, in ${client.channels.cache.size} channels of ${client.guilds.cache.size} guilds.`);
        client.user.setActivity(`chat. | ~? | ~help`, {type: 'WATCHING'});

        aws.login()
            .then(res => {
                console.log(`Logged in to AWS using:`, res.credentials.accessKeyId);

                aws_helpers.s3.setup(res.aws);

                require('./src/app/helpers/playerdata').profile.save();
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
                                if (err !== null) {
                                    console.error('ERROR:', err);
                                }
                            });
                    else {
                        message.delete()
                            .catch(err => message.channel.send(err.message));
                    }
                })
                .catch(err => console.error(err)); 
        }
    });

    return client
}

const client = startup();

module.exports = client;