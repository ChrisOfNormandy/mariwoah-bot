const Discord = require('discord.js');
const { Output, chatFormat, handlers } = require('@chrisofnormandy/mariwoah-bot');

const { getVoiceChannel } = handlers.channels;
const stop = require('../queue/stop');
const queue = require('../queue/map');

/**
 * 
 * @param {Discord.Message} message 
 * @returns {Promise<Output>}
 */
module.exports = (message) => {
    const vc = getVoiceChannel(message);

    if (!vc)
        return Promise.resolve(new Output().setError(new Error('No voice channel.')));
    else {
        vc.leave();

        if (queue.has(message.guild.id))
            return stop(message);

        return Promise.resolve(new Output("Left the voice channel."));
    }
};