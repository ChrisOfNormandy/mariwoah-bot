const queue = require('./queue');

const { Output } = require('@chrisofnormandy/mariwoah-bot');

/**
 *
 * @param {import('@chrisofnormandy/mariwoah-bot').MessageData} data
 * @returns {Promise<Output>}
 */
function pause(data) {
    const q = queue.get(data.message.guild.id);

    if (!q || !q.status())
        return new Output().makeError('No active queue.').reject();

    const v = q.player.pause(true);

    return new Output().setValues(v).resolve();
}

/**
 *
 * @param {import('@chrisofnormandy/mariwoah-bot').MessageData} data
 * @returns {Promise<Output>}
 */
function resume(data) {
    const q = queue.get(data.message.guild.id);

    if (!q || !q.status())
        return new Output().makeError('No active queue.').reject();

    const v = q.player.unpause();

    return new Output().setValues(v).resolve();
}

module.exports = {
    pause,
    resume
};