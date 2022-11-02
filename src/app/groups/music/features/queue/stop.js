const { Output, handlers } = require('@chrisofnormandy/mariwoah-bot');

const { voiceChannel } = handlers.channels;

const queue = require('./queue');
const leave = require('../voiceChannel/leave');

/**
 *
 * @param {import('@chrisofnormandy/mariwoah-bot').MessageData} data
 * @returns {Promise<Output>}
 */
function stop(data) {
    const vc = voiceChannel.get(data.message);

    if (!vc)
        return new Output().makeError('No voice channel.').reject();

    const q = queue.get(data.message.guild.id);

    if (!q || !q.status())
        return new Output().makeError('No active queue.').reject();

    q.player.stop();

    queue.delete(data.message.guild.id);

    return leave(data);
}

module.exports = stop;
