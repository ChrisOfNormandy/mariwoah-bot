const Discord = require('discord.js');

const profile = require('../playerdata/profile');
const { chatFormat, output } = require('../../../../../helpers/commands');

/**
 * 
 * @param {Discord.Message} message 
 * @param {*} data 
 * @returns 
 */
module.exports = (message, data) => {
    return new Promise((resolve, reject) => {
        profile.get(message.author.id)
            .then(data => {
                console.log(data);

                const embed = new Discord.MessageEmbed()
                    .setTitle(`Stats for ${message.member.nickname}`)
                    .setColor(chatFormat.colors.byName.yellow);

                let skills = '';
                for (let i in data.skills)
                    skills += `${i}: ${data.skills[i].score}\n`;

                embed.addField('Skills', skills);

                resolve(output.valid([data], [embed]));
            })
            .catch(err => reject(output.error([err], [err.message])));
    });
};