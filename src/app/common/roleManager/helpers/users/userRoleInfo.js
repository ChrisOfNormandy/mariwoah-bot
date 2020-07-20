const chatFormat = require('../../../bot/helpers/global/chatFormat');
const Discord = require('discord.js');
const getUser = require('./getUser');

module.exports = function (message, userID) {
    getUser(message, userID)
        .then(user => {
            let discord_user = message.channel.guild.members.get(user.id).user;

            let embedMsg = new Discord.RichEmbed()
                .setTitle(discord_user.username + '#' + discord_user.discriminator)
                .setColor(chatFormat.colors.information)
                .addField(
                    `Permissions:`,
                    `Level: ${user.data.permissions.level}\nBot Admin: ${user.data.permissions.botAdmin}\nBot Mod: ${user.data.permissions.botMod}\nBot Helper: ${user.data.permissions.botHelper}\n`
                );

            message.channel.send(embedMsg);
        })
        .catch(e => console.log(e));
}