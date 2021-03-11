const Discord = require('discord.js');
const chatFormat = require('../../../common/bot/helpers/global/chatFormat');
const commandFormat = require('../../../common/bot/helpers/global/commandFormat');
const queue = require('./map');

function field(song, useLink = false) {
    return [
        (useLink) ? song.url : song.title,
        song.duration.timestamp
            ? `Duration: ${song.duration.timestamp}\nRequested by <@${song.requested.id}>`
            : song.playlist.title
                ? `Playlist: ${(useLink) ? song.playlist.url : song.playlist.title} - ${song.playlist.videoCount} videos | Requested by <@${song.requested.id}>`
                : `Requested by <@${song.requested.id}>`
    ];
}

module.exports = function (message, data) {
    if (!queue.has(message.guild.id))
        return Promise.reject(commandFormat.error([], [chatFormat.response.music.queue.no_data()]));

    let q = queue.get(message.guild.id);

    let embed = new Discord.MessageEmbed()
        .setTitle(`Active queue for ${message.guild.name}`)
        .setColor(chatFormat.colors.byName.lightBlue);

    let count = 0;
    let video;
    while (count < q.songs.length && count < chatFormat.response.music.queue.list_length) {
        video = field(q.songs[count], !!data.flags['l']);
        
        if (count == 0) {
            embed.addField(`Now playing:\n${video[0]}`, `By: ${q.songs[0].author}\n${video[1]}`);

            if (q.previousSong != null)
                embed.addField(`Previous: ${q.previousSong.title}`, q.previousSong.url);
        }
        else {
            if (count == 1) {
                embed.addField(`Up next:\n${video[0]}`, `By: ${q.songs[1].author}\n${video[1]}`);
                embed.addField(`** ================ **`, `** ================ **`);
            }
            else
                embed.addField(`${count - 1}. ${video[0]}`, `${video[1]}`);
        }
        count++;
    }
    
    if (q.songs.length > chatFormat.response.music.queue.list_length)
        embed.setFooter(`... and ${q.songs.length - count} others.`);

    return Promise.resolve(commandFormat.valid(q.songs, [embed], { clear: 30 } ));
}