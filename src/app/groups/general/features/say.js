const { Output, handlers } = require('@chrisofnormandy/mariwoah-bot');
const { MessageEmbed } = handlers.embed;

/**
 * 
 * @param {Discord.Message} message 
 * @param {MessageData} data
 * @returns {Promise<Output>}
 */
module.exports = (message, data) => {
    const embed = new MessageEmbed()
        .setTitle('Announcement')
        .setColor(handlers.chat.colors.byName.white)
        .makeField(message.member.nickname || message.author.username, data.arguments[0]);

    return new Output()
        .addEmbed(embed)
        .setValues(data.arguments[0])
        .resolve();
};