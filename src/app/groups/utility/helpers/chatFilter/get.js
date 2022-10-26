const { Output, helpers, handlers } = require('@chrisofnormandy/mariwoah-bot');
const { MessageEmbed } = handlers.embed;
// Const { s3 } = require('../../../../helpers/aws');

const { getChat } = helpers.filter;

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
        return Promise.reject(new Output().setError(new Error('Unsupported chat filter name.\nUse `warned`, `kicked` or `banned`.')));

    return new Promise((resolve, reject) => {
        getChat(guildId, filterName)
            .then((json) => {
                const embed = new MessageEmbed()
                    .setTitle(`Chat filter list for \`${filterName}\` phrases.`)
                    .setColor(handlers.chat.colors.byName.darkred);

                let str = '';
                for (let i in json) {
                    str += json[i];
                    if (i < json.length - 1)
                        str += '\n';
                }
                if (!str)
                    str = 'No active filters.';

                embed.makeField('List:', str);

                new Output()
                    .addEmbed(embed)
                    .setValues(json)
                    .handleAsync(resolve);
            })
            .catch((err) => {
                if (err.code === 'NoSuchKey') {
                    s3.object.putData('mariwoah', `guilds/${guildId}/chat_filters`, `${filterName}.json`, '[]')
                        .then((r) => resolve(new Output(`No existing filter \`${filterName}\`. One has been created automatically.`).setValues(r)))
                        .catch((err) => reject(new Output().setError(err)));
                }
                else
                    reject(reject(new Output().setError(err)));
            });
    });
};