const Disord = require('discord.js');
const cache = require('../cache');

const { output } = require('../../../../helpers/commands');
const MessageData = require('../../../../objects/MessageData');

/**
 * 
 * @param {Discord.Message} message 
 * @param {MessageData} data 
 */
module.exports = (message, data) => {
    return new Promise((resolve, reject) => {
        cache.members.set(message.guild, data.arguments[0], message.member)
            .then(() => resolve(output.valid([], ['Joined.'])))
            .catch(err => reject(output.error([err])));
    });
};