const Discord = require('discord.js');
const { MessageData, Output, chatFormat } = require('@chrisofnormandy/mariwoah-bot');

/**
 * 
 * @param {Discord.Message} message 
 * @param {MessageData} data
 * @returns {Promise<Output>}
 */
module.exports = (message, data) => {
    const embed = new Discord.MessageEmbed()
        .setTitle('Announcement')
        .setColor(chatFormat.colors.byName.white)
        .addField(message.member.nickname || message.author.username, data.arguments[0]);

    return Promise.resolve(new Output({embed}).setValues(data.arguments[0]));
};