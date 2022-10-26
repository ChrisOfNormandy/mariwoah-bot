const Discord = require('discord.js');
const { MessageData, Output } = require('@chrisofnormandy/mariwoah-bot');

// const { s3 } = require('../../../../helpers/aws');

const acceptedFilters = ['warned', 'kicked', 'banned'];

/**
 * 
 * @param {Discord.Message} message 
 * @param {MessageData} data 
 * @returns {Promise<Output>}
 */
module.exports = (message, data) => {
    let guildId = message.guild.id;
    let filterName = data.arguments[0];

    if (!acceptedFilters.includes(filterName))
        return Promise.reject('Unsupported chat filter name.\nUse \`warned\`, \`kicked\` or \`banned\`.');

    return new Promise((resolve, reject) => {
        s3.object.get('mariwoah', `guilds/${guildId}/chat_filters/${filterName}.json`)
            .then(() => {
                s3.object.putData('mariwoah', `guilds/${guildId}/chat_filters`, `${filterName}.json`, '[]')
                    .then(r => resolve(new Output(`Cleared \`${filterName}\` filter list.`).setValues(r)))
                    .catch(err => reject(new Output().setError(err)));
            })
            .catch(err => {
                if (err.code == 'NoSuchKey') {
                    s3.object.putData('mariwoah', `guilds/${guildId}/chat_filters`, `${filterName}.json`, `[]`)
                        .then(r => resolve(new Output(`No existing filter \`${filterName}\`. One has been created automatically.`).setValues(r)))
                        .catch(err => reject(new Output().setError(err)));
                }
                else
                    reject(reject(new Output().setError(err)));
            });
    });
};