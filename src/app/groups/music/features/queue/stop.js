const Discord = require('discord.js');
const { Output, chatFormat, handlers } = require('@chrisofnormandy/mariwoah-bot');

const { getVoiceChannel } = handlers;
const queue = require('../queue/map');

/**
 * 
 * @param {Discord.Message} message 
 * @param {string} reason 
 * @returns {Promise<Output>}
 */
module.exports = function (message, reason = null) {
    const vc = getVoiceChannel(message);

    if (!vc)
        return Promise.reject(new Output().setError(new Error('No voice channel.')));

    if (!queue.has(message.guild.id))
        return Promise.reject(new Output().setError(new Error('No active queue.')));

    queue.delete(message.guild.id);
    getVoiceChannel(message).leave();

    return Promise.resolve(new Output(
        reason
            ? reason
            : 'Stopping.'
    ).setValues(reason));
};