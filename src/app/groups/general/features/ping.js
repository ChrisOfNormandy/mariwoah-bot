const Discord = require('discord.js');

const { chatFormat, output } = require('../../../helpers/commands');

module.exports = (message) => {
    return new Promise((resolve, reject) => {
        const embed = new Discord.MessageEmbed()
            .setTitle('Ping')
            .setColor(chatFormat.colors.information);

        message.channel.send('Please wait...')
            .then(msg => {
                embed.addField('Message latency', `${msg.createdTimestamp - message.createdTimestamp}ms.`);
                msg.delete();
                resolve(output.valid([msg.createdTimestamp - message.createdTimestamp], [embed], { clear: 10 }));
            })
            .catch(e => output.error([e], []));
    });
}