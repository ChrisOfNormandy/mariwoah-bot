const Discord = require('discord.js');
const chatFormat = require('../../../common/bot/helpers/global/chatFormat');
const queue = require('./map');

module.exports = function(message) {
    if (!queue.has(message.guild.id))
        return '> There are no songs in the queue.';

    let embedMsg = new Discord.MessageEmbed()
        .setTitle('Active queue:')
        .setColor(chatFormat.colors.information);
    let songs = queue.get(message.guild.id).songs;

    let count = 0;
    while (count < 20 && count < songs.length) {
        embedMsg.addField(`${count + 1}. ${songs[count].song.title} | ${songs[count].song.author}`, `Duration: ${songs[count].song.durationString} | Requested by ${songs[count].request}`);
        count++
    }
    if (songs.length > 20)
        embedMsg.setFooter(`... and ${songs.length - count} others.`);
    
    return embedMsg;
}