const Discord = require('discord.js');
const { Output } = require('@chrisofnormandy/mariwoah-bot');

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

                resolve(new Output(list).setValues(names));
            })
            .catch(err => {
                if (err.KeyCount == 0)
                    reject(new Output('There are no factions in this server.\nTry creating one using:\n> ~fc create').setError(err));
                else
                    reject(new Output().setError(err));
            });
    });
};