const chatFormat = require('../../../bot/helpers/global/chatFormat');
const Discord = require('discord.js');
const getUser = require('./getUser');

function getList(message, userID, discord_user, user, operation) {
    let embedMsg = new Discord.MessageEmbed();
    if (user.data[operation].length) {
        embedMsg.setTitle((discord_user) ? `${discord_user.username}#${discord_user.discriminator} - ${operation}` : `${userID} - ${operation}`);
        embedMsg.setColor(chatFormat.colors.information);
        
        let obj;
        for (let i = 0; i < user.data[operation].length; i++) {
            obj = user.data[operation][i];
            embedMsg.addField(
                `${i + 1} - ${message.channel.guild.members.get(obj.staffID).user.username}`,
                `Reason: "${obj.reason || 'No reason given'}" on ${obj.date.day} at ${obj.date.time}.
                ${(obj.pardoned.value) ? `Pardoned by ${message.channel.guild.members.get(obj.pardoned.staffID).user.username}.\nReason: "${obj.pardoned.reason || 'No reason given'}" on ${obj.pardoned.date.day} at ${obj.pardoned.date.time}.` : ''}`
            );
        }
    }
    else
        return `User doesn't have any ${operation} on record.`;
    return embedMsg;
}

module.exports = function (message, userID, listName) {
    getUser(message, userID)
        .then(user => {
            let discord_user = (message.channel.guild.members.get(userID)) ? message.channel.guild.members.get(userID).user : null;
            message.channel.send(getList(message, userID, discord_user, user, listName));
        })
        .catch(e => console.log(e));
}