const Discord = require('discord.js');
const { chatFormat, output } = require('../../../helpers/commands');

const get = require('./get');
const set = require('./set');


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
                console.log(faction);

                if (!faction.members[message.author.id]) {
                    reject(output.error([message.author.id], [`You are not a member of that faction.`]));
                }
                else {
                    if (faction.members[message.author.id].roles.includes('Leader')) {
                        if (/#[0-9a-f]{6}/.test(data.arguments[1])) {
                            faction.roleColor = data.arguments[1];
                            set(message, factionName, faction)
                                .then(r => resolve(output.valid([faction], [`Updated the faction color for ${factionName}.`])))
                                .catch(err => reject(output.error([err], [err.message])));
                        }
                        else
                            reject(output.error([data.arguments[1]], [`Incorrectly formatted role color. Should be a hex value; ex: #ffffff`]));
                    }
                    else
                        reject(output.error([faction], [`You must be a faction leader to change the faction color.`]));
                }

            })
            .catch(err => reject(output.error([err], [err.message])));
    });
}