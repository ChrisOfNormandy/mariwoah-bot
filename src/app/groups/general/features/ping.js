const Discord = require('discord.js');
const { Output, handlers } = require('@chrisofnormandy/mariwoah-bot');

/**
 * 
 * @param {Discord.Message} message 
 * @returns {Promise<Output>}
 */
module.exports = (message) => {
    const embed = new Discord.MessageEmbed()
        .setTitle('Ping')
        .setColor(handlers.chat.colors.information);

    return new Promise((resolve, reject) => {
        message.channel.send('Please wait...')
            .then((msg) => {
                embed.addField('Message latency', `${msg.createdTimestamp - message.createdTimestamp}ms.`);

                msg.delete()
                    .then(() => resolve(new Output({ embeds: [embed] }).setValues(msg.createdTimestamp - message.createdTimestamp).setOption('clear', { delay: 10 })))
                    .catch((err) => reject(new Output().setError(err)));
            })
            .catch((err) => reject(new Output().setError(err)));
    });
};