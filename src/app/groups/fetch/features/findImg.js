const { Discord, MessageData, Output, chatFormat} = require('@chrisofnormandy/mariwoah-bot');

const search = require('duckduckgo-images-api').image_search;

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
        search(params)
            .then(res => {
                const index = !!data.flags.has('r') ? Math.floor(Math.random() * res.length) : 0;
                const img = res[index];

                const embed = new Discord.MessageEmbed()
                    .setTitle(`Results for ${query}`)
                    .setColor(chatFormat.colors.byName.aqua)
                    .setImage(img.image)
                    .setDescription(`Image ${index + 1} of ${res.length}`)
                    .setFooter(`Source: ${img.url}\nFetched from ${img.source} via duckduckgo.`);

                resolve(new Output(embed).setValues(img));
            })
            .catch(err => reject(new Output().setError(err)));
    });
};