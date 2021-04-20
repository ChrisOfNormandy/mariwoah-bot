const Discord = require('discord.js');
const chatFormat = require('../../../common/bot/helpers/global/chatFormat');
const commandFormat = require('../../../common/bot/helpers/global/commandFormat');
// const sql = require('../../../sql/adapter');

module.exports = function(guild_id, name, value) {
    return new Promise((resolve, reject) => {
        sql.playlists.setVisibility(guild_id, name, value)
            .then(() => {
                let embed = new Discord.MessageEmbed()
                    .setTitle(name)
                    .setColor(chatFormat.colors.byName.lightgreen)
                    .addField(`Changed visibility to ${value ? 'public' : 'private'}.`, `${value ? 'All available Discord servers can see this playlist.' : 'Only this Discord server can see this playlist.'}`);
                resolve(commandFormat.valid([value], [embed]));
            })
            .catch(e => reject(commandFormat.error([e], [])));
    });
} 