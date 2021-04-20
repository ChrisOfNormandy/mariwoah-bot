const getEmbedSongInfo = require('../../helpers/getEmbedSongInfo');
const { chatFormat, output } = require('../../../../helpers/commands');

module.exports = (message, data) => {
    return new Promise((resolve, reject) => {
        getEmbedSongInfo.songInfo(message, data)
            .then(embed => resolve(output.valid([embed], [embed])))
            .catch(e => reject(output.error([e], [chatFormat.response.music.info.error()])));
    });
}