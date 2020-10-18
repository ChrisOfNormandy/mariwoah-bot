const chatFormat = require('../../../common/bot/helpers/global/chatFormat');
const commandFormat = require('../../../common/bot/helpers/global/commandFormat');
const Discord = require('discord.js');
const sql = require('../../../sql/adapter');

function byName(guild_id, name) {
    return new Promise((resolve, reject) => {
        sql.playlists.get(guild_id, name)
            .then(list => {
                let embed = new Discord.MessageEmbed()
                    .setTitle(`Songs in the playlist: ${name}`)
                    .setColor(chatFormat.colors.information);

                if (!list.length)
                    embed.addField(`Nothing found.`, `You can add songs using:\n> playlist add ${name} {song title / youtube url(s)}`);
                else {
                    let song, index;
                    for (let i in list) {
                        index = Number(i) + 1;
                        song = JSON.parse(list[i].song);
                        embed.addField(`${index}. ${song.title}`,`${song.author} | Duration: ${song.duration.timestamp}\n${song.url}`);
                    }
                }
                
                resolve(commandFormat.valid(list, [embed]));
            })
            .catch(e => reject(commandFormat.error[e], []));
    });
}

function all(guild_id) {
    return new Promise((resolve, reject) => {
        sql.playlists.list(guild_id)
            .then(playlists => {
                let embed = new Discord.MessageEmbed()
                    .setTitle(`Available Playlists`)
                    .setColor(chatFormat.colors.information);
                
                let promiseArr = [];
                for (let i in playlists)
                    promiseArr.push(sql.playlists.get(guild_id, playlists[i].name));
                
                Promise.all(promiseArr)
                    .then(list => {
                        for (let i in playlists) {
                            let index = Number(i) + 1;
                            embed.addField(`${index}. ${playlists[i].name}`, `${list[i].length} song${list[i].length != 1 ? 's' : ''}.`);
                        }

                        resolve(commandFormat.valid([playlists, list], [embed]));
                    })
                    .catch(e => reject(commandFormat.error([e], [])));
            })
            .catch(e => reject(commandFormat.error[e], []));
    });
}

module.exports = function (guild_id, name = null) {
    if (!name)
        return all(guild_id);
    return byName(guild_id, name);
}