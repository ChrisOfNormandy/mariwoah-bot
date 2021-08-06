const Discord = require('discord.js');
const { MessageData, Output, chatFormat } = require('@chrisofnormandy/mariwoah-bot');

const getEmbedSongInfo = require('../../helpers/getEmbedSongInfo');

/**
 * 
 * @param {Discord.Message} message 
 * @param {MessageData} data 
 * @returns {Promise<Output>}
 */
module.exports = (message, data) => {
    return new Promise((resolve, reject) => {
        getEmbedSongInfo.songInfo(message, data)
            .then(embed => resolve(new Output({embed})))
            .catch(err => reject(new Output().setError(err)));
    });
};