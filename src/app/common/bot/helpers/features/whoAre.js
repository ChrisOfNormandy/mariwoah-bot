const chatFormat = require('../global/chatFormat');
const Discord = require('discord.js');
const sql = require('../../../../sql/adapter')

function formatResponse(name, joinDate, roleList, member, data) {
    const user = member.user;

    if (user.bot)
        name += ' -=[BOT]=-'
    let embedMsg = new Discord.MessageEmbed()
        .setTitle(name)
        .setColor(chatFormat.colors.information)
        .addField("Join date", joinDate)
        .addField("Roles", roleList, true)
        .addField("Admin", member.hasPermission("ADMINISTRATOR") ? "Yes" : "No", true)
        .addField("User ID", data.user_id)
        .addField("Permission level", data.permission_level, true)
        .addField("Bot role", (data.bot_role === null) ? "None" : data.bot_role, true);

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
    member.roles.cache.forEach((role, k, m) => {
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

        return new Promise((resolve, reject) => {
            sql.user.get(message.guild.id, user.id)
                .then(data => {
                    let embedMsg = formatResponse(`${user.username}#${user.discriminator}`, joinDate, roles, member, data);
                    resolve(embedMsg);
                })
                .catch(e => {
                    console.log(e);
                    reject('> Failed to gather user data.');
                });
        });
    },

    member: function (message) {
        let user = message.mentions.users.first();
        let member = message.guild.member(user);

        let joinDate = getDate(new Date(member.joinedTimestamp));
        let roles = getRoles(member, message);

        return new Promise((resolve, reject) => {
            sql.user.get(message.guild.id, user.id)
                .then(data => {
                    let embedMsg = formatResponse(`${user.username}#${user.discriminator}`, joinDate, roles, member, data);
                    resolve(embedMsg);
                })
                .catch(e => {
                    console.log(e);
                    resolve('> Failed to gather user data.');
                });
        });
    }
}