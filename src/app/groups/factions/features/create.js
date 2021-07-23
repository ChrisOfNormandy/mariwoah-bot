const Discord = require('discord.js');

const { output } = require('../../../helpers/commands');
const MessageData = require('../../../objects/MessageData');

const cache = require('./cache');

/**
 * 
 * @param {Discord.Message} message 
 * @param {MessageData} data 
 * @returns 
 */
module.exports = (message, data) => {
    let factionName = data.arguments[0];

    return new Promise((resolve, reject) => {
        if (data.admin && data.flags.has('f')) {
            cache.set(message.guild, factionName)
                .then(faction => {
                    faction.addMember(message.member)
                        .then(member => {
                            member.addRole('Leader');
                            faction.upload()
                                .then(() => resolve(output.valid([faction], [`Established a new faction named ${faction.getName()}`])))
                                .catch(err => reject(err));
                        })
                        .catch(err => reject(output.error([err])));
                })
                .catch(err => reject(output.error([err])));
        }
        else
            cache.get(message.guild, factionName)
                .then(faction => reject(output.error([faction], ['Faction already exists.'])))
                .catch(() => {
                    cache.set(message.guild, factionName)
                        .then(faction => {
                            faction.addMember(message.member)
                                .then(member => {
                                    member.addRole('Leader');
                                    faction.upload()
                                        .then(() => resolve(output.valid([faction], [`Established a new faction named ${faction.getName()}`])))
                                        .catch(err => reject(err));
                                })
                                .catch(err => reject(output.error([err])));
                        })
                        .catch(err => reject(output.error([err])));
                });
    });
};