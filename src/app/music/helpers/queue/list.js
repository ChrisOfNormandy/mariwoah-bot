const Discord = require('discord.js');
const chatFormat = require('../../../common/bot/helpers/global/chatFormat');
const queue = require('./map');

module.exports = function(message, data) {
    if (!queue.has(message.guild.id))
        return {value: chatFormat.response.music.queue.no_data()};

    let embed = new Discord.MessageEmbed()
        .setTitle('Active queue:')
        .setColor(chatFormat.colors.byName.lightblue);

    let songs = queue.get(message.guild.id).songs;

    let count = 0;
    if (data.flags['l'])
        while (count < 20 && count < songs.length) {
            embed.addField(`${count + 1}. ${songs[count].song.url} | ${songs[count].song.author}`, `Duration: ${songs[count].song.durationString} | Requested by ${songs[count].request}`);
            count++
        }
    else
        while (count < 20 && count < songs.length) {
            embed.addField(`${count + 1}. ${songs[count].song.title} | ${songs[count].song.author}`, `Duration: ${songs[count].song.durationString} | Requested by ${songs[count].request}`);
            count++
        }
    if (songs.length > 20)
        embed.setFooter(`... and ${songs.length - count} others.`);
    
    return {embed};
}