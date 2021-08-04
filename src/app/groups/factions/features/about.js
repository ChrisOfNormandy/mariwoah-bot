const Discord = require('discord.js');
const { MessageData, Output, chatFormat } = require('@chrisofnormandy/mariwoah-bot');

const responses = require('../../../responses.json');

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
        return Promise.reject(new Output().setError(new Error(responses.groups.factions.error.noFactionName)));

    return new Promise((resolve, reject) => {
        cache.get(message.guild, factionName)
            .then(faction => {
                let embed = new Discord.MessageEmbed()
                    .setTitle(`${responses.groups.factions.command.about.embed.title}${faction.getName()}`)
                    .setColor(faction.getRoleColor() || responses.groups.factions.command.about.embed.color.default)
                    .setThumbnail(faction.getIcon());

                faction.getMembers().forEach(user => embed.addField(user.getName(), user.getRoles().join(', ') || responses.groups.factions.error.noRoles));

                resolve(new Output({embed}).setValues(faction));
            })
            .catch(err => reject(new Output().setError(err)));
    });
};