const Discord = require('discord.js');
const getUser = require('./getUser');

module.exports = async function(message, userID) {
    getUser(message, userID)
    .then(user => {
        console.log(user);
        let discord_user = message.channel.guild.members.get(user.id).user;

        let embedMsg = new Discord.RichEmbed()
            .setTitle(discord_user.username + '#' + discord_user.discriminator)
            .addField(`Permissions:`, `Level: ${user.data.permissions.level}\nBot Admin: ${user.data.permissions.botAdmin}\nBot Mod: ${user.data.permissions.botMod}\nBot Helper: ${user.data.permissions.botHelper}\n`)

        message.channel.send(embedMsg);
    })
    .catch(e => console.log(e));
}