const chatFormat = require('../../../common/bot/helpers/global/chatFormat');
const Discord = require('discord.js');
const fs = require('fs');
const fileExists = require('../../../common/bot/helpers/files/fileExists');
const paths = require('../../../common/bot/helpers/global/paths');
const writeFile = require('../../../common/bot/helpers/files/writeFile');

module.exports = function (message, playlistName) {
    let path = `${paths.getPlaylistPath(message)}`;
    if (!fs.existsSync(path))
        fs.mkdirSync(path); // Check if playlist directory exists. If not, create it.

    fileExists(`${path}${playlistName}.json`)
        .then(() => {
            let embedMsg = new Discord.RichEmbed()
                .setTitle('Error')
                .setColor(chatFormat.colors.byName.red)
                .addField('There already exists a playlist named:', playlistName);
            message.channel.send(embedMsg);
        })
        .catch(err => {
            let blankObject = { playlist: [] };

            writeFile(`${path}${playlistName}.json`, blankObject)
                .then(() => {
                    let embedMsg = new Discord.RichEmbed()
                        .setTitle('Created new playlist')
                        .setColor(chatFormat.colors.byName.green)
                        .addField('Successfully created playlist:', playlistName);
                    message.channel.send(embedMsg);
                })
                .catch(e => console.log(e));
        });
}