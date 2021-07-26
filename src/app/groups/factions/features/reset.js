const Discord = require('discord.js');
const MessageData = require('../../../objects/MessageData');

const { Output } = require('../../../helpers/commands');

const cache = require('./cache');
const create = require('./create');

/**
 * 
 * @param {Discord.Message} message 
 * @param {MessageData} data 
 * @returns {Promise<Output>}
 */
module.exports = (message, data) => {
    if (!data.admin)
        return Promise.reject(new Output().setError(new Error('Member lacks permissions.')));
        
    return new Promise((resolve, reject) => {
        cache.delete(message.guild, data.arguments[0], message.member)
            .then(() => {
                create(message, data)
                    .then(r => resolve(new Output('Faction has been reset.').setValues(r)))
                    .catch(err => reject(new Output().setError(err)));
            })
            .catch(err => reject(new Output().setError(err)));
    });
};