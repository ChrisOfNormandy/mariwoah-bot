const { Output, handlers } = require('@chrisofnormandy/mariwoah-bot');

const { getVoiceChannel } = handlers.channels;

/**
 *
 * @param {import('@chrisofnormandy/mariwoah-bot').MessageData} data
 * @returns {Promise<Output>}
 */
module.exports = (data) => {
    const vc = getVoiceChannel(data.message);

    if (!vc)
        return new Output().makeError('No voice channel.').reject();

    return new Promise((resolve, reject) => {
        vc.join()
            .then((r) => new Output().setValues(r).resolve(resolve))
            .catch((err) => new Output().setError(err).reject(reject));
    });
};