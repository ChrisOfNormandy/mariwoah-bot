const { Output, handlers } = require('@chrisofnormandy/mariwoah-bot');

const { MessageEmbed } = handlers.embed;

const queue = require('./queue');

/**
 *
 * @param {import('../../helpers/SongData')} song
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
 * @param {import('@chrisofnormandy/mariwoah-bot').MessageData} data
 * @returns {Promise<Output>}
 */
module.exports = (data) => {
    const q = queue.get(data.message.guild.id);

    if (!q || !q.status())
        return new Output().makeError('No active queue.').reject();

    let embed = new MessageEmbed()
        .setTitle(`Active queue for ${data.message.guild.name}`)
        .setColor(handlers.chat.colors.byName.aqua);

    let count = 0;

    while (count < q.songs.length && count < 20) {
        const video = field(q.songs[count], data.flags.has('l'));

        if (count === 0) {
            embed.makeField(`Now playing:\n${video[0]}`, `By: ${q.songs[0].author}\n${video[1]}`);

            if (q.previousSong !== null)
                embed.makeField(`Previous: ${q.previousSong.title}`, q.previousSong.url);
        }
        else if (count === 1) {
            embed.makeField(`Up next:\n${video[0]}`, `By: ${q.songs[1].author}\n${video[1]}`);
            embed.makeField('** ================ **', '** ================ **');
        }
        else
            embed.makeField(`${count - 1}. ${video[0]}`, `${video[1]}`);

        count++;
    }

    if (q.songs.length > 20)
        embed.makeFooter(`... and ${q.songs.length - count} others.`);

    return new Output()
        .addEmbed(embed)
        .setValues(q.songs)
        .setOption('clear', { delay: 30 })
        .resolve();
};