const chatFormat = require('../../common/bot/helpers/global/chatFormat');
const Discord = require('discord.js');
const getSong = require('./getSong');
const queue = require('./queue/map');

function embedSongInfo(song) {
    console.log(song);
    let embedMsg = new Discord.MessageEmbed()
        .setTitle(song.title)
        .setColor(chatFormat.colors.youtube)
        .setThumbnail(song.thumbnail.url)
        .setURL(song.url)
        .addField(song.author, `Duration: ${song.durationString}`);

    return embedMsg;
}

module.exports = {
    single: function (title, activeQueue, index) {
        return new Promise((resolve, reject) =>  {
            if (!activeQueue.songs[index])
                reject(null);

            const song = activeQueue.songs[index].song || null;
            const requested = activeQueue.songs[index].request || 'Unknown';

            const embed = {
                color: chatFormat.colors.youtube,
                title: title,
                url: song.url,
                description: 'Powered by YouTube and pure rage.',
                image: {
                    url: song.thumbnail.url
                },
                fields: [
                    {
                        name: song.title,
                        value: `${song.author} | Requested: ${requested}`
                    },
                    {
                        name: `Duration: ${song.durationString}`,
                        value: `Queue position: ${index}`
                    }
                ]
            }

            resolve({embed});
        });
    },
    queueList: function (activeQueue) {
        return new Promise((resolve, reject) =>  {
            const song = activeQueue.songs[0];

            let embedMsg = new Discord.MessageEmbed()
                .setTitle('Current song queue')
                .setColor(chatFormat.colors.youtube)
                .setThumbnail(song.thumbnail.url)
                .addField(`Now playing: ${song.title}`, `${song.author} | Duration: ${song.durationString}\n
                    Requested: ${song.requested.username}`);

            if (activeQueue.previousSong) {
                embedMsg.addField(`Previous: ${activeQueue.previousSong.title}`, activeQueue.previousSong.url);
            }
            if (activeQueue.songs.length > 1) {
                let upTo = (activeQueue.songs.length > 11) ? 11 : activeQueue.songs.length;
                for (let i = 1; i < upTo; i++) {
                    embedMsg.addField(`${(activeQueue.songs[i].removed) ? `x${i}x` : i}. ${activeQueue.songs[i].title}`,
                        `Requested: ${activeQueue.songs[i].requested.username}`);
                }
            }
            else
                embedMsg.setFooter(`Use "~play" or "~playlist play" to add more songs!`);

            resolve(embedMsg);
        });
    },
    possibleSongs: async function (videos) {
        return new Promise((resolve, reject) =>  {
            if (!videos) {
                reject(null);
            }

            let embedMsg = new Discord.MessageEmbed()
                .setTitle(`Here's what I found...`)
                .setColor(chatFormat.colors.youtube);

            for (let i = 0; i < 5; i++)
                embedMsg.addField(`${videos[i].title}`, videos[i].author);

            resolve(embedMsg);
        })
    },
    songInfo: function (message, data) {
        return new Promise((resolve, reject) =>  {
            if (data.urls.length) {
                getSong.byUrl(message, data.urls[0])
                    .then((song) => {
                        resolve(embedSongInfo(song));
                    })
                    .catch(e => reject(e));
            }
            else {
                if (data.arguments.join(' ') == 'this') {
                    if (queue.has(message.guild.id)) {
                        let songs = queue.get(message.guild.id).songs;
                        resolve(embedSongInfo(songs[0].song));
                    }
                    else {
                        resolve(chatFormat.response.music.queue.no_active());
                    }
                }
                else {
                    getSong.byName(message, data.arguments.join(' '))
                        .then((song) => {
                            resolve(embedSongInfo(song));
                        })
                        .catch(e => reject(e));
                }
            }
        });
    }
}