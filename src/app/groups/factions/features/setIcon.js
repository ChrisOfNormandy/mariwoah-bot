const Discord = require('discord.js');

const { output } = require('../../../helpers/commands');
const MessageData = require('../../../objects/MessageData');

const cache = require('./cache');

/**
 * 
 * @param {Discord.Message} message 
 * @param {MessageData} data 
 * @returns 
 */
module.exports = (message, data) => {
    const factionName = data.arguments[0];

    return new Promise((resolve, reject) => {
        cache.get(message.guild, factionName)
            .then(faction => {
                let member = faction.getMember(message.author.id);
                if (member === null)
                    reject(output.error([message.author.id], [`You are not a member of that faction.`]));
                else {
                    if (member.hasRole('Leader')) {
                        faction.setIcon(data.urls[0]);

                        faction.upload()
                            .then(() => resolve(output.valid([faction], [`Updated the faction icon for ${factionName}.`])))
                            .catch(err => reject(output.error([err])));
                    }
                    else
                        reject(output.error([faction], [`You must be a faction leader to change the faction icon.`]));
                }
            })
            .catch(err => reject(output.error([err])));
    });
};