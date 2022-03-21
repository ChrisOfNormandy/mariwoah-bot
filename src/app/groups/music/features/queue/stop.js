// eslint-disable-next-line no-unused-vars
const Discord = require('discord.js');
const { Output, handlers } = require('@chrisofnormandy/mariwoah-bot');

const { voiceChannel } = handlers.channels;
const queue = require('./queue');
const leave = require('../voiceChannel/leave');

/**
 * 
 * @param {Discord.Message} message 
 * @param {string} reason 
 * @returns {Promise<Output>}
 */
module.exports = (message) => {
    const vc = voiceChannel.get(message);

    if (!vc)
        return Promise.reject(new Output().setError(new Error('No voice channel.')));

    if (!queue.exists(message.guild.id))
        return Promise.reject(new Output().setError(new Error('No active queue.')));

    const q = queue.get(message.guild.id);
    q.player.stop();

    queue.delete(message.guild.id);

    return new Promise((resolve, reject) => {
        leave(message)
            .then((r) => resolve(r))
            .catch((err) => reject(err));
    });
};