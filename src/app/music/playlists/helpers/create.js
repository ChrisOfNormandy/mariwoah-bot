const chatFormat = require('../../../common/bot/helpers/global/chatFormat');
const Discord = require('discord.js');
const db = require('../../../sql/adapter');

module.exports = function (message, playlistName) {
    db.playlists.create(message, playlistName)
        .then(data => {
            let embedMsg = new Discord.MessageEmbed()
                .setTitle('Created new playlist')
                .setColor(chatFormat.colors.byName.green)
                .addField('Successfully created playlist:', playlistName);
            message.channel.send(embedMsg);
        })
        .catch(e => {
            console.log(e);
            let embedMsg = new Discord.MessageEmbed()
                .setTitle('Error')
                .setColor(chatFormat.colors.byName.red)
                .addField('There already exists a playlist named:', playlistName);
            message.channel.send(embedMsg);
        });
}