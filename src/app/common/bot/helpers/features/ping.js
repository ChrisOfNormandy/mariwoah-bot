const Discord = require('discord.js');
const chatFormat = require('../global/chatFormat');

module.exports = function (message, client) {
    return new Promise((resolve, reject) => {
        let embed = new Discord.MessageEmbed()
            .setTitle('Ping')
            .setColor(chatFormat.colors.information);

        message.channel.send('Please wait...')
            .then(msg => {
                embed.addField('Message latency', `${msg.createdTimestamp - message.createdTimestamp}ms.`);
                msg.delete();
                resolve(embed);
            });
    });
}