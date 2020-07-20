const chatFormat = require('../../common/bot/helpers/global/chatFormat');
const Discord = require('discord.js');

const append = require('./helpers/append');
const create = require('./helpers/create');
const remove = require('./helpers/remove');
const list = require('./helpers/list');
const play = require('./helpers/play');

const queue = require('../helpers/queue/map');

module.exports = {
    play,
    list: (message, playlistName) => { return list.byName(message, playlistName) },
    listAll: (message) => { return list.all(message) },
    create: (message, playlistName) => { return create(message, playlistName) },
    delete: (message, playlistName) => { return remove.playlist(message, playlistName) },
    remove: (message, playlistName, songURL) => { return remove.song(message, playlistName, songURL) },
    append: (message, data) => {
        return new Promise((resolve, reject) => {
            let playlistName = data.arguments[1];

            if (data.urls.length) {
                resolve(append.byURLs(message, playlistName, data.urls));
            }
            else {
                let songName = data.arguments.slice(2).join(' ');
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
                    append.byName(message, playlistName, songName)
                        .then(song => {
                            let embed = new Discord.MessageEmbed();
                            if (song !== undefined) {
                                embed.setTitle(`${song.title}`);
                                embed.setColor(chatFormat.colors.byName.green);
                                embed.setThumbnail(song.thumbnail.url);
                                embed.setURL(song.url);
                                embed.addField(':writing_hand: Success!', `Added song to the playlist.`);
                                resolve({embed});
                            }
                            else {
                                embed.setTitle(`Error`);
                                embed.setColor(chatFormat.colors.byName.red);
                                embed.addField(':interrobang: Oops!', 'Failed to add song to playlist.');
                                resolve({embed});
                            }
                        })
                        .catch(e => reject(e));
                }
            }
        });
    }
}