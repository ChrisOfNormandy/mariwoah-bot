const Discord = require('discord.js');

function formatResponse(name, joinDate, roleList, user) {
    if (user.bot)
        name += ' -=[BOT]=-'
    let embedMsg = new Discord.RichEmbed()
        .setTitle(name)
        .setColor("#e6ffff")
        .addField("Join date", joinDate)
        .addField("Roles", roleList);

    return embedMsg;
}

function getDate(date) {
    let days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    let months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    return `${days[date.getDay()]}, ${months[date.getMonth()]} ${date.getDate()} ${date.getFullYear()}`
}

function getRoles(member, message) {
    let roles = '';
    for (let role in member._roles) {
        roles += `${message.guild.roles.get(member._roles[role]).name}`
        roles += (member._roles.length > 1 && role < member._roles.length - 1) ? ', ' : '';
    }
    return roles;
}

module.exports = {
    self: function (message) {
        let m = message.member;
        let u = m.user;

        let joinDate = getDate(new Date(m.joinedTimestamp));
        let roles = getRoles(m, message);
        let msg = formatResponse(u.username + '#' + u.discriminator, joinDate, roles, u);

        message.channel.send(msg);
    },

    member: function (message) {
        let id = message.mentions.users.first().id;
        let user = message.guild.members.get(id);
        let u = user.user;

        let joinDate = getDate(new Date(user.joinedTimestamp));
        let roles = getRoles(user, message);
        let msg = formatResponse(u.username + '#' + u.discriminator, joinDate, roles, u);

        message.channel.send(msg);
    }
}