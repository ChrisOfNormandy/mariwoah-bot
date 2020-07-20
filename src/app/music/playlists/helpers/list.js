const chatFormat = require('../../../common/bot/helpers/global/chatFormat');
const Discord = require('discord.js');
const divideArray = require('../../../common/bot/helpers/global/divideArray');
const sql = require('../../../sql/adapter');
const intToTimeString = require('../../../common/bot/helpers/global/intToTimeString');

function byName(message, name) {
    return new Promise((resolve, reject) => {
        sql.playlists.getList(message, name)
            .then(list => {
                let embed = new Discord.MessageEmbed()
                    .setTitle(`Song list for ${name}`)
                    .setColor(chatFormat.colors.information);

                let song;
                for (let i in list) {
                    song = list[i];
                    embed.addField(`${song.title} | ${song.author}`, `${song.url} - Duration: ${song.durationString}`);
                }
                
                resolve({embed});
            })
            .catch(e => reject(e));
    });
}

function all(message, index = 0) {
    return new Promise((resolve, reject) => {
        sql.playlists.getAll(message)
            .then(list => {
                let embed = new Discord.MessageEmbed()
                    .setTitle(`List of available playlists`)
                    .setColor(chatFormat.colors.information);

                let pl;
                let array = [];

                for (let i in list)
                    array.push(list[i]);

                let count;
                divideArray(array, 20)
                    .then(arr => {
                        for (let i in arr[index]) {
                            pl = arr[index][i];
                            count = (JSON.parse(pl.list) === null) ? 0 : JSON.parse(pl.list).length;
                            embed.addField(`${pl.name} | ${message.guild.members.cache.get(pl.creator_id).user.username || ''}`, `${count} songs - Duration: ${intToTimeString.seconds(pl.duration).string}`);
                        }
                        resolve({embed});
                    })
                    .catch(e => reject(e));
            })
            .catch(e => reject(e));
    });
}

module.exports = {
    byName,
    all
}