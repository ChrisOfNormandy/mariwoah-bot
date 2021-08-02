const Discord = require('discord.js');
const { Output, chatFormat } = require('@chrisofnormandy/mariwoah-bot');

const getVC = require('../../../../helpers/getVoiceChannel');
const queue = require('../queue/map');

/**
 * 
 * @param {Discord.Message} message 
 * @param {string} reason 
 * @returns {Promise<Output>}
 */
module.exports = function (message, reason = null) {
    const vc = getVC(message);
    
    if (!vc)
        return Promise.reject(new Output().setError(new Error(chatFormat.response.music.no_vc())));

    if (!queue.has(message.guild.id))
        return Promise.reject(new Output().setError(new Error(chatFormat.response.music.stop.no_queue())));

    queue.delete(message.guild.id);
    getVC(message).leave();

    return Promise.resolve(new Output(
        reason
            ? reason
            : chatFormat.response.music.stop.plain()
    ).setValues(reason));
};