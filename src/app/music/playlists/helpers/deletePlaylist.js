const chatFormat = require('../../../common/bot/helpers/global/chatFormat');
const deleteFile = require('../../../common/bot/helpers/files/deleteFile');
const Discord = require('discord.js');
const fileExists = require('../../../common/bot/helpers/files/fileExists');
const paths = require('../../../common/bot/helpers/global/paths');

module.exports = function (message, playlistName) {
    let path = paths.getPlaylistPath(message);

    fileExists(`${path}${playlistName}.json`)
        .then(() => {
            deleteFile(`${path}${playlistName}.json`)
                .then(() => {
                    let embedMsg = new Discord.RichEmbed()
                        .setTitle('Success')
                        .setColor(chatFormat.colors.byName.green)
                        .addField('Deleted the playlist named:', playlistName);
                    message.channel.send(embedMsg);
                })
                .catch(e => console.log(e));
        })
        .catch(e => {
            let embedMsg = new Discord.RichEmbed()
                .setTitle('Error')
                .setColor(chatFormat.colors.byName.red)
                .addField('Could not delete playlist named:', playlistName);
            message.channel.send(embedMsg);
        });
}