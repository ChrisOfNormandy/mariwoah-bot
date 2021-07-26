const Discord = require('discord.js');
const MessageData = require('../../../objects/MessageData');

const { Output } = require('../../../helpers/commands');

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
                                .then(() => resolve(new Output(`Established a new faction named ${faction.getName()}`).setValues(faction)))
                                .catch(err => reject(new Output().setError(err)));
                        })
                        .catch(err => reject(new Output().setError(err)));
                })
                .catch(err => reject(new Output().setError(err)));
        }
        else
            cache.get(message.guild, factionName)
                .then(faction => reject(new Output().setValues(faction).setError(new Error('Faction already exists.'))))
                .catch(() => {
                    cache.set(message.guild, factionName)
                        .then(faction => {
                            faction.addMember(message.member)
                                .then(member => {
                                    member.addRole('Leader');
                                    faction.upload()
                                        .then(() => resolve(new Output(`Established a new faction named ${faction.getName()}`).setValues(faction)))
                                        .catch(err => reject(new Output().setError(err)));
                                })
                                .catch(err => reject(new Output().setError(err)));
                        })
                        .catch(err => reject(new Output().setError(err)));
                });
    });
};