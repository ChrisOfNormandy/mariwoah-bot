const Discord = require('discord.js');
const { Output, chatFormat } = require('@chrisofnormandy/mariwoah-bot');

const queue = require('./map');
const getVC = require('../../../../helpers/getVoiceChannel');
const getEmbedSongInfo = require('../../helpers/getEmbedSongInfo');

/**
 * 
 * @param {Discord.Message} message 
 * @returns {Promise<Output>}
 */
module.exports = (message) => {
    if (!getVC(message))
        return Promise.reject(new Output().setError(new Error(chatFormat.response.music.no_vc())));

    if (!queue.has(message.guild.id) || !queue.get(message.guild.id).active)
        return Promise.reject(new Output().setError(new Error(chatFormat.response.music.skip.no_queue())));

    queue.get(message.guild.id).connection.dispatcher.end();

    return Promise.resolve(new Output(
        queue.get(message.guild.id).songs.length > 1
            ? getEmbedSongInfo.single('Now playing...', queue.get(message.guild.id), 1)
            : chatFormat.response.music.skip.plain())
    );
};