const Discord = require('discord.js');
const { MessageData, Output } = require('@chrisofnormandy/mariwoah-bot');

const cache = require('./cache');

/**
 * 
 * @param {Discord.Message} message 
 * @param {MessageData} data 
 * @returns {Promise<Output>}
 */
module.exports = (message, data) => {
    const factionName = data.arguments[0];

    return new Promise((resolve, reject) => {
        cache.get(message.guild, factionName)
            .then(faction => {
                let member = faction.getMember(message.author.id);
                if (member === null)
                    reject(new Output().setError(new Error(`You are not a member of that faction.`)));
                else {
                    if (member.hasRole('Leader')) {
                        faction.setIcon(data.urls[0]);

                        faction.upload()
                            .then(() => resolve(new Output(`Updated the faction icon for ${factionName}.`).setValues(faction)))
                            .catch(err => reject(new Output().setError(err)));
                    }
                    else
                        reject(new Output().setError(new Error(`You must be a faction leader to change the faction icon.`)));
                }
            })
            .catch(err => reject(new Output().setError(err)));
    });
};