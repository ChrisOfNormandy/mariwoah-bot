const Discord = require('discord.js');
const chatFormat = require('../../common/bot/helpers/global/chatFormat');

function single(message, type, data) {
    let datetime = new Date(data.datetime);
    let date = datetime.toLocaleDateString();
    let time = datetime.toLocaleTimeString();
    let embed = new Discord.MessageEmbed()
        .setTitle(`Latest ${type} for ${data.username || 'Unknown'} | ${data.user_id}`)
        .setColor(chatFormat.colors.information)
        .addField(`Ticket reference number: ${data.ticket_id}`,
            `Executed on ${date} at ${time}\n` +
            `Staff: ${message.guild.members.cache.get(data.staff_id) || 'Unavailable'} | ${data.staff_id}\n` +
            `Reason: ${data.reason}`);
    return embed;
}

function array(message, type, array) {
    let datetime, date, time;
    let embed = new Discord.MessageEmbed()
        .setTitle(`All ${type}s for ${array[0].username || 'Unknown'} | ${array[0].user_id}`)
        .setColor(chatFormat.colors.information);

    for (let i in array) {
        datetime = new Date(array[i].datetime);
        date = datetime.toLocaleDateString();
        time = datetime.toLocaleTimeString();
        embed.addField(`Ticket reference number: ${array[i].ticket_id}`,
            `Executed on ${date} at ${time}\n` +
            `Staff: ${message.guild.members.cache.get(array[i].staff_id) || 'Unavailable'} | ${array[i].staff_id}\n` +
            `Reason: ${array[i].reason}`);
    }
    return embed;
}

module.exports = {
    single,
    array
}