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
                        console.log(data.arguments);
                        if (data.arguments[1] == '<URL:0>') {
                            faction.iconHref = data.urls[0];
                            cache.set(message.guild.id, factionName, faction)
                                .then(r => resolve(output.valid([faction], [`Updated the faction icon for ${factionName}.`])))
                                .catch(err => reject(output.error([err], [err.message])));
                        }
                        else
                            reject(output.error([data.arguments[1]], [`Incorrectly formatted icon href. Should be a URL value.`]));
                    }
                    else
                        reject(output.error([faction], [`You must be a faction leader to change the faction icon.`]));
                }
            })
            .catch(err => reject(output.error([err], [err.message])));
    });
}