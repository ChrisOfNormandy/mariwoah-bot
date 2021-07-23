const Discord = require('discord.js');

const { chatFormat, output } = require('../../../helpers/commands');

const MessageData = require('../../../objects/MessageData');
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
        return Promise.reject(output.error([], ['No faction name specified.']));

    return new Promise((resolve, reject) => {
        cache.get(message.guild, factionName)
            .then(faction => {
                let embed = new Discord.MessageEmbed()
                    .setTitle(`About ${faction.getName()}`)
                    .setColor(faction.getRoleColor() || chatFormat.colors.byName.darkred)
                    .setThumbnail(faction.getIcon());

                faction.getMembers().forEach(user => embed.addField(user.getName(), user.getRoles().join(', ') || 'No roles.'));

                resolve(output.valid([faction], [embed]));
            })
            .catch(err => reject(output.error([err])));
    });
};