const Discord = require('discord.js');
const getUser = require('./getUser');

module.exports = async function (message, userID, listName) {
    getUser(message, userID)
        .then(user => {
            let discord_user = (message.channel.guild.members.get(userID)) ? message.channel.guild.members.get(userID).user : null;

            let embedMsg = new Discord.RichEmbed();

            switch (listName) {
                case 'warnings': {
                    if (user.data.warnings.length) {
                        embedMsg.setTitle((discord_user) ? discord_user.username + '#' + discord_user.discriminator + ' - Warnings' : `${userID} - Warnings`);

                        let obj;
                        for (let i in user.data.warnings) {
                            obj = user.data.warnings[i];
                            embedMsg.addField(
                                `${i + 1} - ${message.channel.guild.members.get(obj.staffID).user.username}`,
                                `Reason: "${obj.reason || 'No reason given'}" on ${obj.date.day} at ${obj.date.time}.`
                            );
                        }
                    }
                    else
                        return message.channel.send(`User doesn't have any warnings on record.`);
                    break;
                }
                case 'kicks': {
                    if (user.data.kicks.length) {
                        embedMsg.setTitle((discord_user) ? discord_user.username + '#' + discord_user.discriminator + ' - Kicks' : `${userID} - Kicks`);

                        let obj;
                        for (let i in user.data.kicks) {
                            obj = user.data.kicks[i];
                            embedMsg.addField(
                                `${i + 1} - ${message.channel.guild.members.get(obj.staffID).user.username}`,
                                `Reason: "${obj.reason || 'No reason given'}" on ${obj.date.day} at ${obj.date.time}.`
                            );
                        }
                    }
                    else
                        return message.channel.send(`User doesn't have any kicks on record.`);
                    break;
                }
                case 'bans': {
                    if (user.data.bans.length) {
                        embedMsg.setTitle((discord_user) ? discord_user.username + '#' + discord_user.discriminator + ' - Bans' : `${userID} - Bans`);

                        let obj;
                        for (let i in user.data.bans) {
                            obj = user.data.bans[i];
                            embedMsg.addField(
                                `${i + 1} - ${message.channel.guild.members.get(obj.staffID).user.username}`,
                                `Reason: "${obj.reason || 'No reason given'}" on ${obj.date.day} at ${obj.date.time}.`
                            );
                        }
                    }
                    else
                        return message.channel.send(`User doesn't have any bans on record.`);
                    break;
                }
                case 'banReverts': {
                    if (user.data.banReverts.length) {
                        embedMsg.setTitle((discord_user) ? discord_user.username + '#' + discord_user.discriminator + ' - Ban Reverts' : `${userID} - Ban Reverts`);

                        let obj;
                        for (let i in user.data.banReverts) {
                            obj = user.data.banReverts[i];
                            embedMsg.addField(
                                `${i + 1} - ${message.channel.guild.members.get(obj.staffID).user.username}`,
                                `Reason: "${obj.reason || 'No reason given'}" on ${obj.date.day} at ${obj.date.time}.`
                            );
                        }
                    }
                    else
                        return message.channel.send(`User doesn't have any ban reverts on record.`);
                    break;
                }
            }

            message.channel.send(embedMsg);
        })
        .catch(e => console.log(e));
}