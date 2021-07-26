const Disord = require('discord.js');
const MessageData = require('../../../../objects/MessageData');

const { Output } = require('../../../../helpers/commands');

const cache = require('../cache');

/**
 * 
 * @param {Discord.Message} message 
 * @param {MessageData} data 
 */
module.exports = (message, data) => {
    return new Promise((resolve, reject) => {
        cache.members.set(message.guild, data.arguments[0], message.member)
            .then(() => resolve(new Output('Joined.')))
            .catch(err => reject(new Output().setError(err)));
    });
};