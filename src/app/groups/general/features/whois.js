const Discord = require('discord.js');

const { chatFormat, output } = require('../../../helpers/commands');

function formatEmbed(name, joinDate, roleList, member) {
    const user = member.user;

    if (user.bot)
        name += ' -=[BOT]=-';

    let embed = new Discord.MessageEmbed()
        .setTitle(name)
        .setColor(chatFormat.colors.information)
        .addField("Join date", joinDate)
        .addField("Roles", roleList, true)
        .addField("Admin", member.hasPermission("ADMINISTRATOR") ? "Yes" : "No", true);
    return embed;
}

function getDate(date) {
    const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    return `${days[date.getDay()]}, ${months[date.getMonth()]} ${date.getDate()} ${date.getFullYear()}`;
}

function getRoles(member) {
    let roles = '';
    let count = 0;

    member.roles.cache.forEach((role, k, m) => {
        roles += `${role}`;
        roles += (member.roles.cache.size > 1 && count < member.roles.cache.size - 1) ? ', ' : '';
        count++;
    });

    return roles;
}

module.exports = {
    self: (message) => {
        const member = message.member;
        const user = member.user;
        const joinDate = getDate(new Date(member.joinedTimestamp));
        const roles = getRoles(member, message);

        return new Promise((resolve, reject) => {
            const embed = formatEmbed(`${user.username}#${user.discriminator}`, joinDate, roles, member);
            resolve(output.valid([user], [embed]));
        });
    },

    member: (message) => {
        const user = message.mentions.users.first();
        const member = message.guild.member(user);
        const joinDate = getDate(new Date(member.joinedTimestamp));
        const roles = getRoles(member, message);

        return new Promise((resolve, reject) => {
            const embed = formatEmbed(`${user.username}#${user.discriminator}`, joinDate, roles, member);
            resolve(output.valid([user], [embed]));
        });
    }
}