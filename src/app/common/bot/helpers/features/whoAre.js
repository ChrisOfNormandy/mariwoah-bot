const chatFormat = require('../global/chatFormat');
const Discord = require('discord.js');

function formatResponse(name, joinDate, roleList, user) {
    if (user.bot)
        name += ' -=[BOT]=-'
    let embedMsg = new Discord.MessageEmbed()
        .setTitle(name)
        .setColor(chatFormat.colors.information)
        .addField("Join date", joinDate)
        .addField("Roles", roleList);

    return embedMsg;
}

function getDate(date) {
    let days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    let months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    return `${days[date.getDay()]}, ${months[date.getMonth()]} ${date.getDate()} ${date.getFullYear()}`;
}

function getRoles(member) {
    let roles = '';
    let count = 0;
    member.roles.cache.forEach((role, k, t) => {
        roles += `${role}`
        roles += (member.roles.cache.size > 1 && count < member.roles.cache.size - 1) ? ', ' : '';
        count++;
    });

    return roles;
}

module.exports = {
    self: function (message) {
        let member = message.member;
        let user = member.user;

        let joinDate = getDate(new Date(member.joinedTimestamp));
        let roles = getRoles(member, message);
        let embedMsg = formatResponse(`${user.username}#${user.discriminator}`, joinDate, roles, user);

        message.channel.send(embedMsg);
    },

    member: function (message) {
        let user = message.mentions.users.first();
        let member = message.guild.member(user);

        let joinDate = getDate(new Date(member.joinedTimestamp));
        let roles = getRoles(member, message);
        let embedMsg = formatResponse(`${user.username}#${user.discriminator}`, joinDate, roles, user);

        message.channel.send(embedMsg);
    }
}