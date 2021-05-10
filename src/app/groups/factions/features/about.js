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
                let embed = new Discord.MessageEmbed()
                    .setTitle(`About ${faction.name}`)
                    .setColor(faction.roleColor || chatFormat.colors.byName.darkred)
                    .setThumbnail(faction.iconHref);

                for (let user in faction.members)
                    embed.addField(message.guild.members.cache.get(user).displayName, faction.members[user].roles.join(', '));

                resolve(output.valid([faction], [embed]));
            })
            .catch(err => reject(output.error([err], [err.message])));
    });
}