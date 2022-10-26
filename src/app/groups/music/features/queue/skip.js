// eslint-disable-next-line no-unused-vars
const Discord = require('discord.js');
const { Output, handlers } = require('@chrisofnormandy/mariwoah-bot');

const queue = require('./queue');
const { voiceChannel } = handlers.channels;

const play = require('./play');
const stop = require('./stop');

/**
 * 
 * @param {Discord.Message} message 
 * @returns {Promise<Output>}
 */
module.exports = (message) => {
    const vc = voiceChannel.get(message);

    if (!vc)
        return Promise.reject(new Output().setError(new Error('No voice channel.')));

    if (!queue.exists(message.guild.id))
        return Promise.reject(new Output().setError(new Error('No active queue.')));

    const q = queue.get(message.guild.id);

    return new Promise((resolve, reject) => {
        q.player.stop();
        q.songs.shift();

        if (q.songs.length) {
            play(message, q)
                .then((r) => resolve(r))
                .catch((err) => reject(err));
        }
        else {
            stop(message)
                .then((r) => resolve(r))
                .catch((err) => reject(err));
        }
    });
};