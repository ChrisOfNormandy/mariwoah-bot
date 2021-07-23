const Discord = require('discord.js');
const { output } = require('../../../helpers/commands');

const getList = require('./getList');

/**
 * 
 * @param {Discord.Message} message 
 * @returns 
 */
module.exports = (message) => {
    return new Promise((resolve, reject) => {
        getList(message.guild)
            .then(names => {                
                let list = '';
                names.forEach((name, index) => {
                    list += `${name}${index < names.length - 1 ? '\n' : ''}`;
                });

                resolve(output.valid([names], [list]));
            })
            .catch(err => {
                if (err.KeyCount == 0)
                    reject(output.error([err], ['There are no factions in this server.\nTry creating one using:\n> ~fc create']));
                else
                    reject(output.error([err]));
            });
    });
};