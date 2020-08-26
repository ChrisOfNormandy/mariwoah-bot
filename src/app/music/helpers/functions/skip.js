const queue = require('../queue/map');
const getVC = require('../../../common/bot/helpers/global/getVoiceChannel');
const chatFormat = require('../../../common/bot/helpers/global/chatFormat');
const commandFormat = require('../../../common/bot/helpers/global/commandFormat');
const getEmbedSongInfo = require('../getEmbedSongInfo');

module.exports = function (message) {
    if (!getVC(message))
        return commandFormat.error([], [chatFormat.response.music.no_vc()]);
    if (!queue.has(message.guild.id) || !queue.get(message.guild.id).active)
        return commandFormat.error([], [chatFormat.response.music.skip.no_queue()]);

    queue.get(message.guild.id).connection.dispatcher.end();
    return (queue.get(message.guild.id).songs.length > 1)
        ? commandFormat.valid([], [getEmbedSongInfo.single('Now playing...', queue.get(message.guild.id), 1)])
        : commandFormat.valid([], [chatFormat.response.music.skip.plain()]);
}