// const Discord = require('discord.js');
// const {chatFormat, Output} = require('../../../../../helpers/commands');

// module.exports = function(guild_id, name, value) {
//     return new Promise((resolve, reject) => {
//         sql.playlists.setVisibility(guild_id, name, value)
//             .then(() => {
//                 let embed = new Discord.MessageEmbed()
//                     .setTitle(name)
//                     .setColor(chatFormat.colors.byName.lightgreen)
//                     .addField(`Changed visibility to ${value ? 'public' : 'private'}.`, `${value ? 'All available Discord servers can see this playlist.' : 'Only this Discord server can see this playlist.'}`);
//                 resolve(Output.valid([value], [embed]));
//             })
//             .catch(e => reject(Output.error([e], [])));
//     });
// } 