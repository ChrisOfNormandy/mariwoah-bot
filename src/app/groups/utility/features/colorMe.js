const Discord = require('discord.js');
const MessageData = require('../../../objects/MessageData');

const { Output } = require('../../../helpers/commands');

const colorList = [
    'red',
    'orange',
    'yellow',
    'lime',
    'green',
    'light_blue',
    'blue',
    'aqua',
    'cyan',
    'purple',
    'light_pink',
    'pink',
    'magenta',
    'white',
    'grey',
    'gray',
    'light_grey',
    'light_gray',
    'black',
    'brown'
];

/**
 * 
 * @param {Discord.Message} message 
 * @param {MessageData} data 
 * @returns {Promise<Output>}
 */
module.exports = (message, data) => {
    return new Promise((resolve, reject) => {
        if (!colorList.includes(data.arguments[0]))
            reject(new Output().setError(new Error('Color not supported.')));
        else {
            let flag = null;
            message.member.roles.cache.forEach((v, k) => {
                if (colorList.includes(v.name.toLowerCase().replace(' ', '_')))
                    message.member.roles.remove(k)
                        .catch(err => reject(new Output().setError(err)));
            });

            message.guild.roles.cache.forEach((v, k) => {
                if (flag !== null)
                    return;

                if (v.name.toLowerCase() == data.arguments[0] || v.name.toLowerCase().replace(' ', '_') === data.arguments[0])
                    flag = k;
            });

            if (flag !== null) {
                message.member.roles.add(flag)
                    .then(r => resolve(new Output('Done!').setValues(r)))
                    .catch(err => reject(new Output().setError(err)));
            }
            else
                reject(new Output().setError(new Error('No role found.')));
        }
    });
};