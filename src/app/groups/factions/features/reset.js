const Discord = require('discord.js');
const cache = require('./cache');
const create = require('./create');

const { output } = require('../../../helpers/commands');
const MessageData = require('../../../objects/MessageData');

/**
 * 
 * @param {Discord.Message} message 
 * @param {MessageData} data 
 * @returns 
 */
module.exports = (message, data) => {
    if (!message.member.hasPermission('ADMINISTRATOR'))
        return Promise.reject(new Error('Member lacks permissions.'));
        
    return new Promise((resolve, reject) => {
        cache.delete(message.guild, data.arguments[0], message.member)
            .then(() => {
                create(message, data)
                    .then(r => resolve(output.valid([r], ['Faction reset.'])))
                    .catch(err => reject(output.error([err], [err.message])));
            })
            .catch(err => reject(output.error([err])));
    });
};