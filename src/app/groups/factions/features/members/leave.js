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
        cache.get(message.guild, data.arguments[0])
            .then(faction => {
                faction.removeMember(message.member)
                    .then(() => {
                        faction.upload()
                            .then(() => resolve(output.valid([faction], ['Left faction.'])))
                            .catch(err => reject(output.error([err])));
                    })
                    .catch(err => reject(output.error([err])));
            })
            .catch(err => reject(output.error([err])));
    });
};