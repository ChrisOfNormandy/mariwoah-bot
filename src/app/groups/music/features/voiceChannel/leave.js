const stop = require('../queue/stop');
const queue = require('../queue/queue');

const { Output, handlers } = require('@chrisofnormandy/mariwoah-bot');

const { voiceChannel } = handlers.channels;

/**
 * 
 * @param {Discord.Message} message 
 * @returns {Promise<Output>}
 */
module.exports = (message) => {
    const vc = voiceChannel.get(message);

    if (!vc)
        return Promise.resolve(new Output().setError(new Error('No voice channel.')));

    voiceChannel.leave(message);

    if (queue.exists(message.guild.id))
        return stop(message);

    return Promise.resolve(new Output('Left the voice channel.'));
};