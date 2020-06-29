const getVC = require('../../../common/bot/helpers/global/getVoiceChannel');
const stop = require('./stop');
const queue = require('../../queue');

module.exports = function (message) {
    const vc = getVC(message);
    if (!vc) {
        return "You're not in a voice channel, dummy...";
    }
    else {
        vc.leave();
        if (queue.serverMap.has(message.guild.id))
            return stop(message, 'Bot has left the voice channel.');
    }
}