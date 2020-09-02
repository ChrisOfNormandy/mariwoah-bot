const Discord = require('discord.js');

const chatFormat = require('../global/chatFormat');
const commandFormat = require('../global/commandFormat');

module.exports = function (message) {
    return new Promise((resolve, reject) => {
        let embed = new Discord.MessageEmbed()
            .setTitle('Ping')
            .setColor(chatFormat.colors.information);

        message.channel.send('Please wait...')
            .then(msg => {
                embed.addField('Message latency', `${msg.createdTimestamp - message.createdTimestamp}ms.`);
                msg.delete();
                resolve(commandFormat.valid([msg.createdTimestamp - message.createdTimestamp], [embed], {clear: 10}));
            })
            .catch(e => commandFormat.error([e], []));
    });
}