const Discord = require('discord.js');
const { Output, chatFormat } = require('@chrisofnormandy/mariwoah-bot');

/**
 * 
 * @param {Discord.Message} message 
 * @param {string} playlistName 
 * @returns {Promise<Output>}
 */
module.exports = (message, playlistName) => {
    return new Promise((resolve, reject) => {
        sql.playlists.create(message.guild.id, message.author.id, playlistName)
            .then(res => {
                let embed = new Discord.MessageEmbed()
                    .setTitle('Created new playlist')
                    .setColor(chatFormat.colors.byName.green)
                    .addField('Successfully created playlist:', playlistName);

                resolve(new Output({embed}).setValues(res));
            })
            .catch(err => {
                let embed = new Discord.MessageEmbed()
                    .setTitle('Error')
                    .setColor(chatFormat.colors.byName.red)
                    .addField('There already exists a playlist named:', playlistName);

                reject(new Output({embed}).setError(err));
            });
    });
};