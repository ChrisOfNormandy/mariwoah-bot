const Discord = require('discord.js');

const { image_search } = require('duckduckgo-images-api');
const { Output, handlers } = require('@chrisofnormandy/mariwoah-bot');

/**
 * 
 * @param {MessageData} data 
 * @returns {Promise<Output>}
 */
module.exports = (data) => {
    const query = data.arguments[0];
    const params = {
        query,
        moderate: !data.flags.has('N')
    };

    return new Promise((resolve, reject) => {
        image_search(params)
            .then((res) => {
                const index = data.flags.has('r')
                    ? Math.floor(Math.random() * res.length)
                    : 0;
                const img = res[index];

                const embed = new Discord.MessageEmbed()
                    .setTitle(`Results for ${query}`)
                    .setColor(handlers.chat.colors.byName.aqua)
                    .setImage(img.image)
                    .setDescription(`Image ${index + 1} of ${res.length}`)
                    .setFooter({ text: `Source: ${img.url}\nFetched from ${img.source} via duckduckgo.` });

                resolve(new Output({ embeds: [embed] }).setValues(img));
            })
            .catch((err) => reject(new Output().setError(err)));
    });
};