const stop = require('../queue/stop');
const queue = require('../queue/queue');

const { Output, handlers } = require('@chrisofnormandy/mariwoah-bot');

const { voiceChannel } = handlers.channels;

/**
 *
 * @param {import('@chrisofnormandy/mariwoah-bot').MessageData} data
 * @returns {Promise<impot('@chrisofnormandy/mariwoah-bot').Output>}
 */
function leave(data) {
    const vc = voiceChannel.get(data.message);

    if (!vc)
        return new Output().makeError('No voice channel.').reject();

    voiceChannel.leave(data.message);

    if (queue.exists(data.message.guild.id))
        return stop(data);

    return new Output('Left the voice channel.').resolve();
}

module.exports = leave;