const Discord = require('discord.js');

const { chatFormat } = require('../../../helpers/commands');

module.exports = (obj) => {
    const embed = new Discord.MessageEmbed()
        .setTitle('Faction Command Help')
        .setColor(chatFormat.colors.byName.orange);

    for (let i in obj) {
        embed.addField(obj[i]);
    }
};