const chatFormat = require('../../common/bot/helpers/global/chatFormat');
const Discord = require('discord.js');

const addSong = require('./helpers/addSong');

const queue = require('../helpers/queue/map');
const commandFormat = require('../../common/bot/helpers/global/commandFormat');

module.exports = {
    play: require('./helpers/play'),
    list: require('./helpers/list'),
    create: require('./helpers/create'),
    addSong: (message, data) => {
        return new Promise((resolve, reject) => {
            let playlistName = data.arguments[0];

            if (data.urls.length) {
                resolve(append.byURLs(message, playlistName, data.urls));
            }
            else {
                let songName = data.arguments.slice(1).join(' ');
                if (songName == 'this') {
                    if (queue.has(message.guild.id)) {
                        append.bySong(message, playlistName, queue.get(message.guild.id).songs[0].song)
                            .then(song => {
                                let embed = new Discord.MessageEmbed()
                                    .setTitle(`${song.title}`)
                                    .setColor(chatFormat.colors.byName.green)
                                    .setThumbnail(song.thumbnail.url)
                                    .setURL(song.url)
                                    .addField(':writing_hand: Success!', `Added song to the playlist.`);
                                resolve({embed});
                            })
                            .catch(e => reject(e));
                    }
                    else {
                        resolve({value: chatFormat.response.music.queue.no_active()});
                    }
                }
                else {
                    addSong.byName(message, playlistName, songName)
                        .then(song => {
                            let embed = new Discord.MessageEmbed();
                            if (!!song) {
                                embed.setTitle(`${song.title}`);
                                embed.setColor(chatFormat.colors.byName.green);
                                embed.setThumbnail(song.thumbnail.url);
                                embed.setURL(song.url);
                                embed.addField(':writing_hand: Success!', `Added song to the playlist.`);
                                resolve(commandFormat.valid([song], [embed]));
                            }
                            else {
                                embed.setTitle(`Error`);
                                embed.setColor(chatFormat.colors.byName.red);
                                embed.addField(':interrobang: Oops!', 'Failed to add song to playlist.');
                                resolve(commandFormat.valid([], [embed]));
                            }
                        })
                        .catch(e => reject(e));
                }
            }
        });
    }
}