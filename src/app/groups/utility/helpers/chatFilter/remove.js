const { Discord, MessageData, Output } = require('@chrisofnormandy/mariwoah-bot');

const { s3 } = require('../../../../../aws/helpers/adapter');

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
    let phrase = data.arguments[1];

    if (!acceptedFilters.includes(filterName))
        return Promise.reject(new Output().setError(new Error('Unsupported chat filter name.\nUse \`warned\`, \`kicked\` or \`banned\`.')));

    return new Promise((resolve, reject) => {
        s3.object.get('mariwoah', `guilds/${guildId}/chat_filters/${filterName}.json`)
            .then(data => {
                let json = JSON.parse(data.Body.toString());

                if (json.includes(phrase)) {
                    json.splice(json.indexOf(phrase), 1);

                    s3.object.putData('mariwoah', `guilds/${guildId}/chat_filters`, `${filterName}.json`, JSON.stringify(json))
                        .then(r => resolve(new Output(`Removed "${phrase}" from the \`${filterName}\` filter list.`).setValues(json)))
                        .catch(err => reject(new Output().setError(err)));
                }
                else
                    resolve(new Output(`Filter \`${filterName}\` does not include that phrase.`).setValues(phrase));
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