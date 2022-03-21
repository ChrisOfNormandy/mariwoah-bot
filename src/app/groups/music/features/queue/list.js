const Discord = require('discord.js');
const { Output, handlers } = require('@chrisofnormandy/mariwoah-bot');

const queue = require('./queue');
// eslint-disable-next-line no-unused-vars
const SongData = require('../../helpers/SongData');

/**
 * 
 * @param {SongData} song 
 * @param {boolean} useLink 
 * @returns 
 */
function field(song, useLink = false) {
    let str = '';

    if (song.duration.timestamp)
        str += `Duration: ${song.duration.timestamp}`;

    if (song.playlist.url || song.playlist.title || song.playlist.videoCount) {
        str += '\nPlaylist: ';
        str += useLink
            ? song.playlist.url
            : song.playlist.title;
        str += ` - ${song.playlist.videoCount} tracks`;
    }

    if (song.requestedBy)
        str += `\nRequested by <@${song.requestedBy.id}>`;

    if (song.next !== null && song.next.url === song.url)
        str += '\n[ **Looped** ]';

    return [
        useLink
            ? song.url
            : song.title,
        str
    ];
}

/**
 * 
 * @param {Discord.Message} message 
 * @param {MessageData} data 
 * @returns {Promise<Output>}
 */
module.exports = (message, data) => {
    if (!queue.exists(message.guild.id)) {
        const embed = new Discord.MessageEmbed()
            .setFooter({ text: '[ ❗ ] No active queue.' });

        return Promise.reject(new Output().addEmbed(embed));
    }

    const q = queue.get(message.guild.id);

    let embed = new Discord.MessageEmbed()
        .setTitle(`Active queue for ${message.guild.name}`)
        .setColor(handlers.chat.colors.byName.aqua);

    let count = 0;
    let video;
    while (count < q.songs.length && count < 20) {
        video = field(q.songs[count], data.flags.has('l'));

        if (count === 0) {
            embed.addField(`Now playing:\n${video[0]}`, `By: ${q.songs[0].author}\n${video[1]}`);

            if (q.previousSong !== null)
                embed.addField(`Previous: ${q.previousSong.title}`, q.previousSong.url);
        }
        else {
            if (count === 1) {
                embed.addField(`Up next:\n${video[0]}`, `By: ${q.songs[1].author}\n${video[1]}`);
                embed.addField('** ================ **', '** ================ **');
            }
            else
                embed.addField(`${count - 1}. ${video[0]}`, `${video[1]}`);
        }
        count++;
    }

    if (q.songs.length > 20)
        embed.setFooter({ text: `... and ${q.songs.length - count} others.` });

    return Promise.resolve(new Output({ embeds: [embed] }).setValues(q.songs).setOption('clear', { delay: 30 }));
};