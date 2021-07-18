const { chatFormat, output } = require('../../../../../helpers/commands');
const Discord = require('discord.js');

module.exports = (message, playlistName) => {
    return new Promise((resolve, reject) => {
        sql.playlists.create(message.guild.id, message.author.id, playlistName)
            .then(res => {
                let embed = new Discord.MessageEmbed()
                    .setTitle('Created new playlist')
                    .setColor(chatFormat.colors.byName.green)
                    .addField('Successfully created playlist:', playlistName);
                resolve(output.valid([res], [embed]));
            })
            .catch(e => {
                console.error(e);

                let embed = new Discord.MessageEmbed()
                    .setTitle('Error')
                    .setColor(chatFormat.colors.byName.red)
                    .addField('There already exists a playlist named:', playlistName);

                reject(output.error([e], [embed]));
            });
    });
};