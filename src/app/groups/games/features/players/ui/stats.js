const Discord = require('discord.js');
const MessageData = require('../../../../../objects/MessageData');

const { chatFormat, Output } = require('../../../../../helpers/commands');

const profile = require('../playerdata/profile');

/**
 * 
 * @param {Discord.Message} message 
 * @param {MessageData} data 
 * @returns {Promise<Output>}
 */
module.exports = (message, data) => {
    return new Promise((resolve, reject) => {
        profile.get(message.author.id)
            .then(profileData => {
                const embed = new Discord.MessageEmbed()
                    .setTitle(`Stats for ${message.member.nickname}`)
                    .setColor(chatFormat.colors.byName.yellow);

                let skills = '';
                for (let i in profileData.skills)
                    skills += `${i}: ${profileData.skills[i].score}\n`;

                embed.addField('Skills', skills);

                resolve(new Output(embed).setValues(profileData));
            })
            .catch(err => reject(new Output().setError(err)));
    });
};