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
        cache.get(message.guild, data.arguments[0])
            .then(faction => {
                faction.removeMember(message.member)
                    .then(() => {
                        faction.upload()
                            .then(() => resolve(new Output('Left faction.').setValues(faction)))
                            .catch(err => reject(new Output().setError(err)));
                    })
                    .catch(err => reject(new Output().setError(err)));
            })
            .catch(err => reject(new Output().setError(err)));
    });
};