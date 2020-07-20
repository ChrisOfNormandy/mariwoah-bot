const chatFormat = require('../../common/bot/helpers/global/chatFormat');
const Discord = require('discord.js');
const getSongObject = require('./getSong');

module.exports = {
    single: function (title, activeQueue, index) {
        return new Promise((resolve, reject) =>  {
            if (!activeQueue.songs[index])
                reject(null);

            const song = activeQueue.songs[index].song || null;
            const requested = activeQueue.songs[index].request || 'Unknown';

            let embedMsg = new Discord.RichEmbed()
                .setTitle(title)
                .setColor(chatFormat.colors.youtube)
                .setThumbnail(song.thumbnail.url)
                .setURL(song.url)
                .addField(song.title, `${song.author} | Requested: ${requested}`)
                .addField(`Duration: ${song.durationString}`, `Queue position: ${index}`);

            resolve(embedMsg);
        });
    },
    queueList: function (activeQueue) {
        return new Promise((resolve, reject) =>  {
            const song = activeQueue.songs[0];

            let embedMsg = new Discord.RichEmbed()
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

            let embedMsg = new Discord.RichEmbed()
                .setTitle(`Here's what I found...`)
                .setColor(chatFormat.colors.youtube);

            for (let i = 0; i < 5; i++)
                embedMsg.addField(`${videos[i].title}`, videos[i].author);

            resolve(embedMsg);
        })
    },
    songInfo: function (message, songURL = null, songName = null) {
        return new Promise((resolve, reject) =>  {
            if (songURL === null && songName === null)
                reject(null);

            if (songURL !== null) {
                getSongObject.byUrl(message, songURL)
                    .then(async (song) => {
                        let embedMsg = new Discord.RichEmbed()
                            .setTitle('Song information')
                            .setColor(chatFormat.colors.youtube)
                            .setThumbnail(song.thumbnail.url)
                            .setURL(song.url)
                            .addField(song.title, `${song.author} | Duration: ${song.durationString}`)

                        resolve(embedMsg);
                    })
                    .catch(e => reject(e));
            }
            else if (songURL === null && songName !== null) {
                getSongObject.byName(message, songName)
                    .then(async (song) => {
                        let embedMsg = new Discord.RichEmbed()
                            .setTitle('Song information')
                            .setColor(chatFormat.colors.youtube)
                            .setThumbnail(song.thumbnail.url)
                            .setURL(song.url)
                            .addField(song.title, `${song.author} | Duration: ${song.durationString}`);

                        resolve(embedMsg);
                    })
                    .catch(e => reject(e));
            }
        });
    }
}