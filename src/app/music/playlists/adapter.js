const chatFormat = require('../../common/bot/helpers/global/chatFormat');
const Discord = require('discord.js');

const append = require('./helpers/append');
const create = require('./helpers/create');
const remove = require('./helpers/remove');
const list = require('./helpers/list');
const play = require('./helpers/play');

module.exports = {
    play,
    list: (message, playlistName) => {return list.byName(message, playlistName)},
    listAll: (message) => {return list.all(message)},
    create: (message, playlistName) => {return create(message, playlistName)},
    delete: (message, playlistName) => {return remove.playlist(message, playlistName)},
    remove: (message, playlistName, songURL) => {return remove.song(message, playlistName, songURL)},
    append: (message, data) => {
        return new Promise((resolve, reject) => {
            let playlistName = data.arguments[1];
            if (data.urls.length) {
                resolve(append.byURLs(message, playlistName, data.urls));
            }
            else {         
                let songName = data.arguments.slice(2).join(' ');
                append.byName(message, playlistName, songName)
                    .then(song => {
                        let embedMsg = new Discord.MessageEmbed();
                        if (song !== undefined) {
                            embedMsg.setTitle(`${song.title}`);
                            embedMsg.setColor(chatFormat.colors.byName.green);
                            embedMsg.setThumbnail(song.thumbnail.url);
                            embedMsg.setURL(song.url);
                            embedMsg.addField(':writing_hand: Success!', `Added song to the playlist.`);
                            resolve(embedMsg);
                        }
                        else {
                            embedMsg.setTitle(`Error`);
                            embedMsg.setColor(chatFormat.colors.byName.red);
                            embedMsg.addField(':interrobang: Oops!', 'Failed to add song to playlist.');
                            resolve(embedMsg);
                        }
                    })
                    .catch(e => reject(e));
            }
        });
    }
}