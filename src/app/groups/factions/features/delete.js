const Discord = require('discord.js');
const cache = require('./cache');

const { output } = require('../../../helpers/commands');
const MessageData = require('../../../objects/MessageData');

/**
 * 
 * @param {Discord.Message} message 
 * @param {MessageData} data 
 * @returns 
 */
module.exports = (message, data) => {
    return new Promise((resolve, reject) => {
        cache.delete(message.guild, data.arguments[0], message.member)
            .then(r => resolve(output.valid([r], ['Faction deleted.'])))
            .catch(err => reject(output.error([err])));
    });
};