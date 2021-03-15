const getVC = require('../../../../helpers/getVoiceChannel');
const stop = require('../queue/stop');
const queue = require('../queue/map');
const {chatFormat, output} = require('../../../../helpers/commands');

module.exports = (message) => {
    const vc = getVC(message);
    if (!vc)
        return Promise.resolve(output.error([], [chatFormat.response.music.no_vc()]));
    else {
        vc.leave();
        if (queue.has(message.guild.id))
            return Promise.resolve(output.valid([stop(message)], []));
        return Promise.resolve(output.valid([], ["Left the voice channel."]));
    }
}