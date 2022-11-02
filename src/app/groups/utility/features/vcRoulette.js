const { Output, handlers } = require('@chrisofnormandy/mariwoah-bot');

const { getVoiceChannel } = handlers.channels;

/**
 *
 * @param {import('@chrisofnormandy/mariwoah-bot').MessageData} data
 * @returns {Promise<Output>}
 */
module.exports = (data) => {
    let roll = Math.floor(Math.random() * 6) + 1;
    if (roll > 6)
        roll = 6;

    let vc = getVoiceChannel(data.message);

    if (!vc)
        return new Output().makeError('Must be in a voice channel to play VC Roulette.').reject();

    if (roll === 1)
        return new Promise((resolve, reject) => {
            data.message.member.voice.kick()
                .then((r) => new Output(`${data.message.member.nickname === null
                    ? data.message.author.username
                    : data.message.member.nickname} has been disconnected.`)
                    .setValues(r)
                    .resolve(resolve))
                .catch((err) => new Output(`${data.message.member.nickname === null
                    ? data.message.author.username
                    : data.message.member.nickname} should have disconnected, but I, the bot, do not have permission to kick them.`)
                    .setError(err)
                    .reject(reject));
        });

    return new Output(`${data.message.member.nickname === null
        ? data.message.author.username
        : data.message.member.nickname} rolled a ${roll}.`)
        .resolve();
};