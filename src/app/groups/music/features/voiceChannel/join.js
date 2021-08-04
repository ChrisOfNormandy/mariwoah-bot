const Discord = require('discord.js');
const { Output, chatFormat, helpers } = require('@chrisofnormandy/mariwoah-bot');

const { getVoiceChannel} = helpers;

/**
 * 
 * @param {Discord.Message} message 
 * @returns {Promise<Output>}
 */
module.exports = (message) => {
    return new Promise((resolve, reject) => {
        const vc = getVoiceChannel(message);

        if (!vc)
            resolve(new Output().setError(new Error(chatFormat.response.music.join.no_vc())));
        else
            vc.join()
                .then(r => resolve(new Output().setValues(r)))
                .catch(err => reject(new Output(chatFormat.response.music.join.join_error()).setError(err)));
    });
};