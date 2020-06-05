const chatFormat = require('../../../common/bot/helpers/global/chatFormat');
const Discord = require('discord.js');
const divideArray = require('../../../common/bot/helpers/global/divideArray');
const db = require('../../../sql/adapter');
const intToTimeString = require('../../../common/bot/helpers/global/intToTimeString');

function byName(message, name) {
    db.playlists.getList(message, name)
        .then(list => {
            let embedMsg = new Discord.MessageEmbed()
                .setTitle(`Song list for ${name}`)
                .setColor(chatFormat.colors.byName.aqua);
            let song;
            for (let i in list) {
                song = list[i];
                embedMsg.addField(`${song.title} | ${song.author}`, `${song.url} - Duration: ${song.durationString}`);
            }
            message.channel.send(embedMsg);
        })
        .catch(e => console.log(e));
}

function all(message, index = 0) {
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
                    message.channel.send(embedMsg);
                })
                .catch(e => console.log(e));
        })
        .catch(e => console.log(e));
}

module.exports = {
    byName,
    all
}

/*
module.exports = async function (message, playlistName, pageNumber = 0, includeLinks = false) {
    let obj;
    try {
        obj = await readFile(`${paths.getPlaylistPath(message)}${playlistName}.json`);
    }
    catch (e) {
        message.channel.send('There is nothing in the playlist.');
        return console.log('Ignore error, empty playlist called.\n', e);
    }

    if (!obj.playlist.length) {
        message.channel.send('There is nothing in the playlist.');
        return;
    }

    divideArray(obj.playlist, 25)
        .then(arrays => {
            let msg = '';
            let num = 0;
            let embedMsg = new Discord.MessageEmbed()
                .setTitle(`Songs in ${playlistName}`)
                .setColor(chatFormat.colors.information);

            if (pageNumber > arrays.length)
                pageNumber = arrays.length - 1
            else if (pageNumber < 1)
                pageNumber = 1;
            pageNumber--;

            for (let i = 0; i < arrays[pageNumber].length; i++) {
                num = i + 1 + 25 * pageNumber;
                if (!arrays[pageNumber][i])
                    continue;
                msg += `${num}. ${arrays[pageNumber][i].title}${includeLinks ? `| ${arrays[pageNumber][i].url}` : ''}\n`;
            }
            if (msg != '') {
                embedMsg.addField(`Page ${pageNumber + 1} of ${arrays.length}`, msg);
                message.channel.send(embedMsg);
            }
            else
                message.channel.send('There are 0 songs in the provided playlist.')
        })
        .catch(e => console.log(e));
}
*/