const { image_search } = require('duckduckgo-images-api');
const { Output, handlers } = require('@chrisofnormandy/mariwoah-bot');
const { MessageEmbed, createFooter, createImage } = handlers.embed;

/**
 *
 * @param {import('@chrisofnormandy/mariwoah-bot').MessageData} data
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

                const embed = new MessageEmbed()
                    .setTitle(`Results for ${query}`)
                    .setColor(handlers.chat.colors.byName.aqua)
                    .setImage(createImage(img.image))
                    .setDescription(`Image ${index + 1} of ${res.length}`)
                    .setFooter(createFooter(`Source: ${img.url}\nFetched from ${img.source} via duckduckgo.`));

                new Output().addEmbed(embed).setValues(img).resolve(resolve);
            })
            .catch((err) => new Output().setError(err).reject(reject));
    });
};