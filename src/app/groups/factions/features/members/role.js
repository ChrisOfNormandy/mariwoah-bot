const Discord = require('discord.js');
const cache = require('../cache');
const MessageData = require('../../../../objects/MessageData');

/**
 * 
 * @param {Discord.Message} message 
 * @param {MessageData} data 
 * @returns 
 */
function add(message, data) {
    return new Promise((resolve, reject) => {
        cache.members.get(message.guild, data.mentions.first(), data.arguments[0])
            .then(() => resolve(null))
            .catch(err => reject(err));
    });
}

module.exports = {
    add
};