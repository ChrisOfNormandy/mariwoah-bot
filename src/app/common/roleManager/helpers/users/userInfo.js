const Discord = require('discord.js');
const getUser = require('./getUser');

module.exports = async function (message, userID) {
    getUser(message, userID)
        .then(user => {
            let discord_user = message.channel.guild.members.get(userID).user;

            let embedMsg = new Discord.RichEmbed()
                .setTitle(discord_user.username + '#' + discord_user.discriminator)
                .addField('Warnings', user.data.warnings.length, true)
                .addField('Kicks', user.data.kicks.length, true)
                .addField('Bans', user.data.bans.length, true)
                .addField('Ban Reverts', user.data.banReverts.length, true);

            if (user.data.warnings.length || user.data.kicks.length || user.data.bans.length || user.data.banReverts.length)
                embedMsg.addBlankField();

            if (user.data.warnings.length)
                embedMsg.addField(`Latest warning - ${message.channel.guild.members.get(user.data.warnings[user.data.warnings.length - 1].staffID).user.username}`, `Reason: "${user.data.latestWarning.reason || 'No reason given'}" on ${user.data.latestWarning.date.day} at ${user.data.latestWarning.date.time}.`);
            if (user.data.kicks.length)
                embedMsg.addField('Latest warning', `Reason: "${user.data.latestKick.reason || 'No reason given'}" on ${user.data.latestKick.time}.`);
            if (user.data.bans.length)
                embedMsg.addField('Latest warning', `Reason: "${user.data.latestBan.reason || 'No reason given'}" on ${user.data.latestBan.time}.`);
            if (user.data.banReverts.length)
                embedMsg.addField('Latest warning', `Reason: "${user.data.latestBanRevert.reason || 'No reason given'}" on ${user.data.latestWarning.date.day} at ${user.data.latestWarning.date.time}.`);

            message.channel.send(embedMsg);
        })
        .catch(e => console.log(e));
}