const chatFormats = require('../../../common/bot/helpers/chatFormats');
const Discord = require('discord.js');
const fs = require('fs');
const paths = require('../../../common/bot/helpers/paths');

module.exports = function (message, playlistName) {
    try {
        if (!fs.existsSync(paths.getPlaylistPath(message)))
            fs.mkdirSync(paths.getPlaylistPath(message));

        fs.access(path, fs.F_OK, (err) => {
            if (err) {
                fs.open(`${paths.getPlaylistPath(message)}${playlistName}.json`, 'w', function (err) { if (err) return console.log(err); });
                let embedMsg = new Discord.RichEmbed()
                    .setTitle('Created new playlist')
                    .setColor(chatFormats.colors.byName.green)
                    .addField('Successfully created playlist:', playlistName);
                message.channel.send(embedMsg);
                return;
            }
            let embedMsg = new Discord.RichEmbed()
                .setTitle('Error')
                .setColor(chatFormats.colors.byName.red)
                .addField('There already exists a playlist named:', playlistName);
            message.channel.send(embedMsg);
        });
    }
    catch (e) {
        console.log(e);
    }
}