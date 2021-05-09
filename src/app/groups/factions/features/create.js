const Discord = require('discord.js');
const { s3 } = require('../../../../aws/helpers/adapter');
const { chatFormat, output } = require('../../../helpers/commands');

/**
 * 
 * @param {Discord.Message} message 
 * @param {object} data 
 * @returns 
 */
function create(message, data) {
    const factionName = data.arguments[0];

    return new Promise((resolve, reject) => {
        const faction = {
            name: factionName,
            roleColor: null,
            description: null,
            members: {
                [message.author.id]: {
                    id: message.author.id,
                    roles: ['Creator', 'Leader']
                }
            }
        }

        let file = {
            name: `${factionName}.json`,
            type: 'application/json',
            data: faction
        };

        s3.object.putData('mariwoah', `guilds/${message.guild.id}/factions`, file)
            .then(res => resolve(output.valid([file], [`The faction ${factionName} has been established successfully.`])))
            .catch(err => reject(output.error([err], [err.message])));
    });
}

module.exports = (message, data) => {
    const factionName = data.arguments[0];

    return new Promise((resolve, reject) => {
        s3.object.get('mariwoah', `guilds/${message.guild.id}/factions/${factionName}.json`)
            .then(res => {
                if (data.flags.contains('f') && message.member.hasPermission('ADMINISTRATOR'))
                    create(message, data)
                        .then(r => resolve(r))
                        .catch(err => reject(err));
                else
                    reject(output.error([], ['Faction already exists.']))
            })
            .catch(err => {
                create(message, data)
                    .then(r => resolve(r))
                    .catch(err => reject(err));
            });
    });
}