const Discord = require('discord.js');

const { s3 } = require('../../../../../aws/helpers/adapter');
const { chatFormat, output } = require('../../../../helpers/commands');
const getFilter = require('../../../../helpers/filter/getChat');

const acceptedFilters = ['warned', 'kicked', 'banned'];

module.exports = (message, data) => {
    let guildId = message.guild.id;
    let filterName = data.arguments[0];

    if (!acceptedFilters.includes(filterName))
        return Promise.reject('Unsupported chat filter name.\nUse \`warned\`, \`kicked\` or \`banned\`.');

    return new Promise((resolve, reject) => {
        getFilter(guildId, filterName)
            .then(json => {
                const embed = new Discord.MessageEmbed()
                    .setTitle(`Chat filter list for \`${filterName}\` phrases.`)
                    .setColor(chatFormat.colors.byName.darkred);

                let str = '';
                for (let i in json) {
                    str += json[i];
                    if (i < json.length - 1)
                        str += '\n';
                }
                if (!str)
                    str = 'No active filters.';

                embed.addField('List:', str);

                resolve(output.valid([json], [embed]));
            })
            .catch(err => {
                if (err.code == 'NoSuchKey') {
                    s3.object.putData('mariwoah', `guilds/${guildId}/chat_filters`, `${filterName}.json`, '[]')
                        .then(r => resolve(output.valid([r], [`No existing filter \`${filterName}\`. One has been created automatically.`])))
                        .catch(err => reject(output.error([err], [err.message])));
                }
                else
                    reject(reject(output.error([err], [err.message])));
            });
    });
};