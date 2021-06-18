const Discord = require('discord.js');
const { chatFormat, output } = require('../../../helpers/commands');

const cache = require('./cache');

/**
 * 
 * @param {Discord.Message} message 
 * @param {object} data 
 * @returns 
 */
module.exports = (message, data) => {
    const factionName = data.arguments[0];

    return new Promise((resolve, reject) => {
        cache.get(message.guild.id, factionName)
            .then(faction => {
                if (!faction.members[message.author.id])
                    reject(output.error([message.author.id], [`You are not a member of that faction.`]));
                else {
                    if (faction.members[message.author.id].roles.includes('Leader')) {
                        faction.roleColor = data.arguments[1];
                        cache.set(message.guild.id, factionName, faction)
                            .then(r => resolve(output.valid([faction], [`Updated the faction color for ${factionName}.`])))
                            .catch(err => reject(output.error([err], [err.message])));
                    }
                    else
                        reject(output.error([faction], [`You must be a faction leader to change the faction color.`]));
                }
            })
            .catch(err => reject(output.error([err], [err.message])));
    });
}