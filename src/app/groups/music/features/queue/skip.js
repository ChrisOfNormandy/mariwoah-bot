const { Output, handlers } = require('@chrisofnormandy/mariwoah-bot');

const queue = require('./queue');
const { voiceChannel } = handlers.channels;

const play = require('./play');
const stop = require('./stop');

/**
 *
 * @param {import('@chrisofnormandy/mariwoah-bot').MessageData} data
 * @returns {Promise<Output>}
 */
module.exports = (data) => {
    const vc = voiceChannel.get(data.message);

    if (!vc)
        return new Output().makeError('No voice channel.').reject();

    const q = queue.get(data.message.guild.id);

    if (!q || !q.status())
        return new Output().makeError('No active queue.').reject();

    q.player.stop();
    q.songs.shift();

    if (q.songs.length)
        return play(data, q);

    return stop(data);
};