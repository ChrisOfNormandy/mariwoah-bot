const { chatFormat, output } = require('../../../../helpers/commands');
const getVC = require('../../../../helpers/getVoiceChannel');
const queue = require('../queue/map');

module.exports = function (message, reason = null) {
    const vc = getVC(message);
    if (!vc)
        return Promise.reject(output.error([], [chatFormat.response.music.no_vc()]));

    if (!queue.has(message.guild.id))
        return Promise.reject(output.error([], [chatFormat.response.music.stop.no_queue()]));

    queue.delete(message.guild.id);
    getVC(message).leave();

    return Promise.resolve(output.valid([reason], [(reason) ? reason : chatFormat.response.music.stop.plain()]));
};