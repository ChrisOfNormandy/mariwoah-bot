const Discord = require('discord.js');
const MessageData = require('../../../../objects/MessageData');

const { chatFormat, Output } = require('../../../../helpers/commands');

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
            .then(embed => resolve(new Object(embed)))
            .catch(err => reject(new Output(chatFormat.response.music.info.error()).setError(err)));
    });
};