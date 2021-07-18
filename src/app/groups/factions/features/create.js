const Discord = require('discord.js');

const { s3 } = require('../../../../aws/helpers/adapter');
const { output } = require('../../../helpers/commands');

const cache = require('./cache');

/**
 * 
 * @param {Discord.Message} message 
 * @param {*} data 
 * @returns 
 */
function create(message, data) {
    const factionName = data.arguments[0];

    return new Promise((resolve, reject) => {
        const faction = {
            name: factionName,
            roleColor: null,
            iconHref: null,
            description: null,
            members: {
                [message.author.id]: {
                    id: message.author.id,
                    roles: ['Creator', 'Leader']
                }
            }
        };

        let file = {
            name: `${factionName}.json`,
            type: 'application/json',
            data: faction
        };

        s3.object.putData('mariwoah', `guilds/${message.guild.id}/factions`, file)
            .then(() => {
                cache.set(message.guild.id, factionName, faction)
                    .then(r => resolve(output.valid([file], [`The faction ${factionName} has been established successfully.`])))
                    .catch(err => reject(output.error([err], [err.message])));
            })
            .catch(err => reject(output.error([err], [err.message])));
    });
}

/**
 * 
 * @param {Discord.Message} message 
 * @param {*} data 
 * @returns 
 */
module.exports = (message, data) => {
    const factionName = data.arguments[0];

    return new Promise((resolve, reject) => {
        s3.object.get('mariwoah', `guilds/${message.guild.id}/factions/${factionName}.json`)
            .then(() => {
                if (data.flags.includes('f') && message.member.hasPermission('ADMINISTRATOR'))
                    create(message, data)
                        .then(r => resolve(r))
                        .catch(err => reject(err));
                else
                    reject(output.error([], ['Faction already exists.']));
            })
            .catch(() => {
                create(message, data)
                    .then(r => resolve(r))
                    .catch(err => reject(err));
            });
    });
};