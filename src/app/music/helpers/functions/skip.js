const queue = require('../queue/map');
const getVC = require('../../../common/bot/helpers/global/getVoiceChannel');
const chatFormat = require('../../../common/bot/helpers/global/chatFormat');

module.exports = function (message) {
    if (!getVC(message))
        return {value: chatFormat.response.music.no_vc()};
    if (!queue.has(message.guild.id) || !queue.get(message.guild.id).active)
        return {value: chatFormat.response.music.skip.no_queue()};

    queue.get(message.guild.id).connection.dispatcher.end();
    return {value: chatFormat.response.music.skip.plain()};
}