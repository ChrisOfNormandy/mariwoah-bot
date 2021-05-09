const Discord = require('discord.js');
const { s3 } = require('../../../../aws/helpers/adapter');

/**
 * 
 * @param {Discord.Message} message 
 * @param {object} data 
 * @returns 
 */
 module.exports = (message, factionName, factionData) => {
    return new Promise((resolve, reject) => {
        let file = {
            name: `${factionName}.json`,
            type: 'application/json',
            data: factionData
        };

        s3.object.putData('mariwoah', `guilds/${message.guild.id}/factions`, file)
            .then(res => resolve(res))
            .catch(err => reject(err));
    });
}