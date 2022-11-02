const getSong = require('./getSong');
const queue = require('../features/queue/queue');

const { handlers } = require('@chrisofnormandy/mariwoah-bot');
const { MessageEmbed } = handlers.embed;

module.exports = {
    /**
     *
     * @param {SongData} songData
     * @returns {Promise<MessageEmbed>}
     */
    single(songData) {
        const embed = new MessageEmbed()
            .setTitle(songData.title)
            .setColor(handlers.chat.colors.youtube)
            .setURL(songData.url)
            .makeFooter('Powered by YouTube and pure rage.');

        return Promise.resolve(embed);
    },

    /**
     *
     * @param {import('@chrisofnormandy/mariwoah-bot').MessageData} data
     * @returns {Promise<MessageEmbed>}
     */
    songInfo(data) {
        return new Promise((resolve, reject) => {
            if (data.urls.length) {
                getSong.byURL(data.message, data.urls[0])
                    .then((ret) => resolve(ret.getEmbed()))
                    .catch(reject);
            }
            else {
                let name = data.arguments.join(' ').trim();

                if (name === 'this' && queue.exists(data.message.guild.id))
                    resolve(queue.get(data.message.guild.id).songs[0].getEmbed());
                else {
                    getSong.byName(data.message, name)
                        .then((song) => resolve(song.getEmbed()))
                        .catch(reject);
                }
            }
        });
    }
};