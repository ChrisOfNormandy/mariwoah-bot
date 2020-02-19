const chatFormats = require('../../../common/bot/helpers/chatFormats');
const Discord = require('discord.js');
const fs = require('fs');
const paths = require('../../../common/bot/helpers/paths');

module.exports = function (message, playlistName) {
    let path = paths.getPlaylistPath(message);
    try {
        if (!fs.existsSync(path))
            fs.mkdirSync(path);

        fs.access(path, fs.F_OK, (err) => {
            if (err == null) {
                fs.open(`${path}${playlistName}.json`, 'w', function (err) { if (err) return console.log(err); });
                let embedMsg = new Discord.RichEmbed()
                    .setTitle('Created new playlist')
                    .setColor(chatFormats.colors.byName.green)
                    .addField('Successfully created playlist:', playlistName);
                message.channel.send(embedMsg);
                let blankObject = {playlist: []};
                fs.writeFile(`${path}${playlistName}.json`, JSON.stringify(blankObject), 'utf8', (err) => {
                    if (err)
                        return console.log(err);
                });
                return;
            }
            else {
                let embedMsg = new Discord.RichEmbed()
                    .setTitle('Error')
                    .setColor(chatFormats.colors.byName.red)
                    .addField('There already exists a playlist named:', playlistName);
                message.channel.send(embedMsg);
            }
        });
    }
    catch (e) {
        console.log(e);
    }
}