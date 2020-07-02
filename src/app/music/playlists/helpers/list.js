const chatFormat = require('../../../common/bot/helpers/global/chatFormat');
const Discord = require('discord.js');
const divideArray = require('../../../common/bot/helpers/global/divideArray');
const db = require('../../../sql/adapter');
const intToTimeString = require('../../../common/bot/helpers/global/intToTimeString');

function byName(message, name) {
    return new Promise((resolve, reject) => {
        db.playlists.getList(message, name)
            .then(list => {
                console.log(list);
                let embedMsg = new Discord.MessageEmbed()
                    .setTitle(`Song list for ${name}`)
                    .setColor(chatFormat.colors.byName.aqua);

                let song;
                for (let i in list) {
                    song = list[i];
                    embedMsg.addField(`${song.title} | ${song.author}`, `${song.url} - Duration: ${song.durationString}`);
                }
                
                resolve(embedMsg);
            })
            .catch(e => reject(e));
    });
}

function all(message, index = 0) {
    return new Promise((resolve, reject) => {
        db.playlists.getAll(message)
            .then(list => {
                let embedMsg = new Discord.MessageEmbed()
                    .setTitle(`List of available playlists`)
                    .setColor(chatFormat.colors.byName.aqua);
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
                            embedMsg.addField(`${pl.name} | ${message.guild.members.cache.get(pl.creator_id).user.username || ''}`, `${count} songs - Duration: ${intToTimeString.seconds(pl.duration).string}`);
                        }
                        resolve(embedMsg);
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