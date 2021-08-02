const Discord = require('discord.js');
const { Output, chatFormat } = require('@chrisofnormandy/mariwoah-bot');

const getVC = require('../../../../helpers/getVoiceChannel');
const stop = require('../queue/stop');
const queue = require('../queue/map');

/**
 * 
 * @param {Discord.Message} message 
 * @returns {Promise<Output>}
 */
module.exports = (message) => {
    const vc = getVC(message);

    if (!vc)
        return Promise.resolve(new Output().setError(new Error(chatFormat.response.music.no_vc())));
    else {
        vc.leave();

        if (queue.has(message.guild.id))
            return stop(message);

        return Promise.resolve(new Output("Left the voice channel."));
    }
};