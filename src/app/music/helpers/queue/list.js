const Discord = require('discord.js');
const chatFormat = require('../../../common/bot/helpers/global/chatFormat');
const queue = require('./map');

function field(song, useLink = false) {
    return {
        name: (useLink) ? song.url : song.title,
        value: song.duration.timestamp
            ? `Duration: ${song.duration.timestamp} | Requested by ${song.requested}`
            : song.playlist.title
                ? `Playlist: ${(useLink) ? song.playlist.url : song.playlist.title} - ${song.playlist.videoCount} videos | Requested by ${song.requested}`
                : `Requested by ${song.requested}`
    };
}

module.exports = function (message, data) {
    if (!queue.has(message.guild.id))
        return { value: chatFormat.response.music.queue.no_data() };

    let q = queue.get(message.guild.id);
    let songs = q.songs;

    let embed = new Discord.MessageEmbed()
        .setTitle(`Active queue for ${message.guild.name}`)
        .setColor(chatFormat.colors.byName.lightBlue);

    let video = field(songs[0], data.flags['l']);
    embed.addField(`Now playing: ${songs[0].title}`, `By: ${songs[0].author}\n${video.value}`);

    if (q.previousSong != null)
        embed.addField(`Previous: ${q.previousSong.title}`, q.previousSong.url);

    let count = 2;

    video = field(songs[count], data.flags['l']);
    embed.addField(`Up next: ${video.name}`, `${video.value}`);

    while (count < chatFormat.response.music.queue.list_length && count < songs.length) {
        video = field(songs[count], data.flags['l']);
        embed.addField(`${count}: ${video.name}`, `${video.value}`);
        count++;
    }

    if (songs.length > chatFormat.response.music.queue.list_length)
        embed.setFooter(`... and ${songs.length - count} others.`);

    return { embed, options: { clear: 30 } };
}