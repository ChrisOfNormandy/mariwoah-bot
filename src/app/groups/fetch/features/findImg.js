const Discord = require('discord.js');
const {chatFormat, output} = require('../../../helpers/commands');
const search = require('duckduckgo-images-api').image_search;

module.exports = (message, data) => {
    const query = data.arguments[0];
    const params = {
        query,
        moderate: !!!data.flags.includes('N')
    };

    return new Promise((resolve, reject) => {
        search(params)
            .then(res => {
                const index = !!data.flags.includes('r') ? Math.floor(Math.random() * res.length) : 0;
                const img = res[index];

                const embed = new Discord.MessageEmbed()
                    .setTitle(`Results for ${query}`)
                    .setColor(chatFormat.colors.byName.aqua)
                    .setImage(img.image)
                    .setDescription(`Image ${index + 1} of ${res.length}`)
                    .setFooter(`Source: ${img.url}\nFetched from ${img.source} via duckduckgo.`);
                resolve(output.valid([img], [embed]))
            })
            .catch(err => reject(err));
    });
}