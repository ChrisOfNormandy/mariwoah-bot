const { Output, handlers } = require('@chrisofnormandy/mariwoah-bot');
const { MessageEmbed } = handlers.embed;

/**
 *
 * @param {import('@chrisofnormandy/mariwoah-bot').MessageData} data
 * @returns {Promise<Output>}
 */
module.exports = (data) => {
    const embed = new MessageEmbed()
        .setTitle('Ping')
        .setColor(handlers.chat.colors.information);

    return new Promise((resolve, reject) => {
        data.message.channel.send('Please wait...')
            .then((msg) => {
                embed.makeField('Message latency', `${msg.createdTimestamp - data.message.createdTimestamp}ms.`);

                msg.delete()
                    .then(() => new Output().addEmbed(embed).setValues(msg.createdTimestamp - data.message.createdTimestamp).setOption('clear', { delay: 10 }).resolve(resolve))
                    .catch((err) => new Output().setError(err).reject(reject));
            })
            .catch((err) => new Output().setError(err).reject(reject));
    });
};