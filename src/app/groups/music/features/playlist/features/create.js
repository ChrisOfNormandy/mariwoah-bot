const chatFormat = require('../../../common/bot/helpers/global/chatFormat');
const commandFormat = require('../../../common/bot/helpers/global/commandFormat');
const Discord = require('discord.js');
// const sql = require('../../../sql/adapter');

module.exports = function (message, playlistName) {
    console.log(message.guild.id, message.author.id, playlistName)
    return new Promise((resolve, reject) => {
        sql.playlists.create(message.guild.id, message.author.id, playlistName)
            .then(res => {
                let embed = new Discord.MessageEmbed()
                    .setTitle('Created new playlist')
                    .setColor(chatFormat.colors.byName.green)
                    .addField('Successfully created playlist:', playlistName);
                resolve(commandFormat.valid([res], [embed]));
            })
            .catch(e => {
                console.log(e);
                let embed = new Discord.MessageEmbed()
                    .setTitle('Error')
                    .setColor(chatFormat.colors.byName.red)
                    .addField('There already exists a playlist named:', playlistName);
                reject(commandFormat.error([e], [embed]));
            });
    });
}