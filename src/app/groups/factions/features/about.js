const Discord = require('discord.js');
const { MessageData, Output, chatFormat } = require('@chrisofnormandy/mariwoah-bot');

const cache = require('./cache');

/**
 * 
 * @param {Discord.Message} message 
 * @param {MessageData} data 
 * @returns {Promise<{values: *[], content: string[], options: *} | {rejections: Error[] | string[], content: string[]}>}
 */
module.exports = (message, data) => {
    const factionName = data.arguments[0];

    if (!factionName)
        return Promise.reject(new Output().setError(new Error('No faction name specified.')));

    return new Promise((resolve, reject) => {
        cache.get(message.guild, factionName)
            .then(faction => {
                let embed = new Discord.MessageEmbed()
                    .setTitle(`About ${faction.getName()}`)
                    .setColor(faction.getRoleColor() || chatFormat.colors.byName.darkred)
                    .setThumbnail(faction.getIcon());

                faction.getMembers().forEach(user => embed.addField(user.getName(), user.getRoles().join(', ') || 'No roles.'));

                resolve(new Output({embed}).setValues(faction));
            })
            .catch(err => reject(new Output().setError(err)));
    });
};