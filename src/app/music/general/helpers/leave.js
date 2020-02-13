const getVC = require('../../../common/bot/helpers/getVC');
const stop = require('./stop');
const queue = require('../../queue');

module.exports = function (message) {
    const vc = getVC(message);
    if (!vc) {
        message.channel.send("You're not in a voice channel, dummy...");
        return;
    }
    else {
        vc.leave();
        if (queue.serverMap.has(message.guild.id)) {
            stop(message, 'Bot has left the voice channel.');
        }
    }
}