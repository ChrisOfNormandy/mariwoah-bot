const Discord = require('discord.js');

const { s3 } = require('../../../../aws/helpers/adapter');
const { output } = require('../../../helpers/commands');

const get = require('./get');

function remove(message, factionName) {
    return new Promise((resolve, reject) => {
        s3.object.delete('mariwoah', `guilds/${message.guild.id}/factions/${factionName}.json`)
            .then(res => resolve(output.valid([res], [`The faction ${factionName} has been removed successfully.`])))
            .catch(err => reject(output.error([err], [err.message])));
    });
}

/**
 * 
 * @param {Discord.Message} message 
 * @param {object} data 
 * @returns 
 */
module.exports = (message, data) => {
    const factionName = data.arguments[0];

    return new Promise((resolve, reject) => {
        get(message, factionName)
            .then(faction => {
                if (data.flags.includes('f') && message.member.hasPermission('ADMINISTRATOR'))
                    remove(message, factionName)
                        .then(r => resolve(r))
                        .catch(err => reject(err));
                else if (!!faction.members[message.author.id] && faction.members[message.author.id].roles.includes('Leader'))
                    remove(message, factionName)
                        .then(r => resolve(r))
                        .catch(err => reject(err));
                else
                    reject(output.error([], ['You do not have permission to remove this faction.']));
            })
            .catch(err => reject(output.error([err], [`Could not find a faction named ${factionName}.`])));
    });
};