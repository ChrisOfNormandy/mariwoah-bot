const Discord = require('discord.js');
const MessageData = require('../../../objects/MessageData');

const { chatFormat } = require('../../../helpers/commands');

const getSong = require('./getSong');
const queue = require('../features/queue/map');

/**
 * 
 * @param {*} song 
 * @returns {Discord.MessageEmbed}
 */
function embedSongInfo(song) {
    let embed = new Discord.MessageEmbed()
        .setTitle(song.title)
        .setColor(chatFormat.colors.youtube)
        .setImage(song.thumbnail)
        .setURL(song.url)
        .addField(song.author, `Duration: ${song.duration.timestamp}`);

    return embed;
}

module.exports = {
    /**
     * 
     * @param {string} title 
     * @param {*} activeQueue 
     * @param {number} index 
     * @param {*} fromPlaylist 
     * @returns {Discord.MessageEmbed | null}
     */
    single: (title, activeQueue, index, fromPlaylist = false) => {
        if (!activeQueue.songs[index])
            return null;

        const song = activeQueue.songs[index] || null;
        const requested = activeQueue.songs[index].requested || 'Unknown';

        const embed = {
            color: chatFormat.colors.youtube,
            title: title,
            url: song.url,
            footer: {
                text: 'Powered by YouTube and pure rage.'
            },
            image: undefined,
            thumbnail: undefined,
            fields: [
                {
                    name: song.title,
                    value: `${song.author} | Requested: ${requested}`
                },
                {
                    name: song.duration.timestamp
                        ? `Duration: ${song.duration.timestamp}`
                        : song.playlist.title
                            ? `Playlist: ${song.playlist.title}`
                            : 'Enjoy!',
                    value: `Queue position: ${index == 0 ? 'Right now!' : index}`
                }
            ]
        };

        if (fromPlaylist)
            embed.thumbnail = { url: song.thumbnail };
        else
            embed.image = { url: song.thumbnail };

        return embed;
    },

    /**
     * 
     * @param {Discord.Message} message 
     * @param {MessageData} data 
     * @returns {Promise<Discord.MessageEmbed>}
     */
    songInfo: function (message, data) {
        return new Promise((resolve, reject) => {
            if (data.urls.length) {
                getSong.byURL(message, data.urls[0])
                    .then(video => resolve(embedSongInfo(video)))
                    .catch(e => reject(e));
            }
            else {
                if (data.arguments.join(' ').trim() === 'this') {
                    if (queue.has(message.guild.id)) {
                        let songs = queue.get(message.guild.id).songs;
                        resolve(embedSongInfo(songs[0]));
                    }
                    else
                        resolve(chatFormat.response.music.queue.no_active());
                }
                else {
                    getSong.byName(message, data.arguments.join(' '))
                        .then((song) => resolve(embedSongInfo(song)))
                        .catch(e => reject(e));
                }
            }
        });
    }
};