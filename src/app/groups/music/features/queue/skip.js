const queue = require('./map');
const getVC = require('../../../../helpers/getVoiceChannel');
const { chatFormat, output } = require('../../../../helpers/commands');
const getEmbedSongInfo = require('../../helpers/getEmbedSongInfo');

module.exports = (message) => {
    if (!getVC(message))
        return Promise.reject(output.error([], [chatFormat.response.music.no_vc()]));

    if (!queue.has(message.guild.id) || !queue.get(message.guild.id).active)
        return Promise.reject(output.error([], [chatFormat.response.music.skip.no_queue()]));

    queue.get(message.guild.id).connection.dispatcher.end();

    return (queue.get(message.guild.id).songs.length > 1)
        ? Promise.resolve(output.valid([], [getEmbedSongInfo.single('Now playing...', queue.get(message.guild.id), 1)]))
        : Promise.resolve(output.valid([], [chatFormat.response.music.skip.plain()]));
};