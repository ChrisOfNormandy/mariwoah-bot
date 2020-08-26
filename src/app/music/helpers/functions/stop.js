const chatFormat = require('../../../common/bot/helpers/global/chatFormat');
const commandFormat = require('../../../common/bot/helpers/global/commandFormat');
const getVC = require('../../../common/bot/helpers/global/getVoiceChannel');
const queue = require('../queue/map');

module.exports = function (message, reason = null) {
    const vc = getVC(message);
    if (!vc)
        return commandFormat.error([], [chatFormat.response.music.no_vc()]);

    if (!queue.has(message.guild.id))
        return commandFormat.error([], [chatFormat.response.music.stop.no_queue()]);

    queue.delete(message.guild.id);
    getVC(message).leave();

    return commandFormat.valid([reason], [(reason) ? reason : chatFormat.response.music.stop.plain()]);
}