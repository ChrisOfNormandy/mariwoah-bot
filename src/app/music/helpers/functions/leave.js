const getVC = require('../../../common/bot/helpers/global/getVoiceChannel');
const stop = require('./stop');
const queue = require('../queue/map');
const chatFormat = require('../../../common/bot/helpers/global/chatFormat');
const commandFormat = require('../../../common/bot/helpers/global/commandFormat');

module.exports = function (message) {
    const vc = getVC(message);
    if (!vc)
        return commandFormat.error([], [chatFormat.response.music.no_vc()]);
    else {
        vc.leave();
        if (queue.has(message.guild.id))
            return commandFormat.valid([stop(message)], []);
    }
}