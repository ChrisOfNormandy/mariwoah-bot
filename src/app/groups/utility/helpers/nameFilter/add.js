const { s3 } = require('../../../../../aws/helpers/adapter');
const { output } = require('../../../../helpers/commands');

const acceptedFilters = ['warned', 'kicked', 'banned'];

module.exports = (message, data) => {
    let guildId = message.guild.id;
    let filterName = data.arguments[0];
    let phrase = data.arguments[1];

    if (!acceptedFilters.includes(filterName))
        return Promise.reject('Unsupported name filter name.\nUse \`warned\`, \`kicked\` or \`banned\`.');

    return new Promise((resolve, reject) => {
        s3.object.get('mariwoah', `guilds/${guildId}/name_filters/${filterName}.json`)
            .then(data => {
                let json = JSON.parse(data.Body.toString());

                if (!json.includes(phrase)) {
                    json.push(phrase);

                    s3.object.putData('mariwoah', `guilds/${guildId}/name_filters`, `${filterName}.json`, JSON.stringify(json))
                        .then(r => resolve(output.valid([r], [`Added "${phrase}" to the \`${filterName}\` filter list.`])))
                        .catch(err => reject(output.error([err], [err.message])));
                }
                else
                    resolve(output.valid([phrase], [`Filter \`${filterName}\` already includes that phrase.`]));
            })
            .catch(err => {
                if (err.code == 'NoSuchKey') {
                    s3.object.putData('mariwoah', `guilds/${guildId}/name_filters`, `${filterName}.json`, `["${phrase}"]`)
                        .then(r => resolve(output.valid([r], [`No existing filter \`${filterName}\`. One has been created automatically with the provided phrase included.`])))
                        .catch(err => reject(output.error([err], [err.message])));
                }
                else
                    reject(reject(output.error([err], [err.message])));
            });
    });
};