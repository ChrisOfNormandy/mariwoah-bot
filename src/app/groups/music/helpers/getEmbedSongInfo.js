const getSong = require('./getSong');
const Discord = require('discord.js');
const queue = require('../features/queue/queue');

const { handlers } = require('@chrisofnormandy/mariwoah-bot');

module.exports = {
    /**
     * 
     * @param {SongData} songData
     * @returns {Promise<Discord.MessageEmbed>}
     */
    single(songData) {
        const embed = new Discord.MessageEmbed()
            .setTitle(songData.title)
            .setColor(handlers.chat.colors.youtube)
            .setURL(songData.url)
            .setFooter({ text: 'Powered by YouTube and pure rage.' });

        return Promise.resolve(embed);
    },

    /**
     * 
     * @param {Discord.Message} message 
     * @param {MessageData} data 
     * @returns {Promise<Discord.MessageEmbed>}
     */
    songInfo(message, data) {
        return new Promise((resolve, reject) => {
            if (data.urls.length) {
                getSong.byURL(message, data.urls[0])
                    .then((ret) => resolve(ret.getEmbed()))
                    .catch((e) => reject(e));
            }
            else {
                let name = data.arguments.join(' ').trim();

                if (name === 'this' && queue.exists(message.guild.id))
                    resolve(queue.get(message.guild.id).songs[0].getEmbed());
                else {
                    getSong.byName(message, name)
                        .then((song) => resolve(song.getEmbed()))
                        .catch((err) => reject(err));
                }
            }
        });
    }
};