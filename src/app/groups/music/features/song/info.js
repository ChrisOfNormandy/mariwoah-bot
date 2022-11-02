const { Output } = require('@chrisofnormandy/mariwoah-bot');

const getEmbedSongInfo = require('../../helpers/getEmbedSongInfo');

/**
 *
 * @param {import('@chrisofnormandy/mariwoah-bot').MessageData} data
 * @returns {Promise<Output>}
 */
module.exports = (data) => {
    return new Promise((resolve, reject) => {
        getEmbedSongInfo.songInfo(data)
            .then((embed) => new Output().addEmbed(embed).resolve(resolve))
            .catch((err) => new Output().setError(err).reject(reject));
    });
};