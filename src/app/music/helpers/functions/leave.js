const getVC = require('../../../common/bot/helpers/global/getVoiceChannel');
const stop = require('./stop');
const queue = require('../queue/map');
const chatFormat = require('../../../common/bot/helpers/global/chatFormat');
const commandFormat = require('../../../common/bot/helpers/global/commandFormat');

module.exports = (message) => {
    const vc = getVC(message);
    if (!vc)
        return Promise.resolve(commandFormat.error([], [chatFormat.response.music.no_vc()]));
    else {
        vc.leave();
        if (queue.has(message.guild.id))
            return Promise.resolve(commandFormat.valid([stop(message)], []));
        return Promise.resolve(commandFormat.valid([], ["Left the voice channel."]));
    }
}