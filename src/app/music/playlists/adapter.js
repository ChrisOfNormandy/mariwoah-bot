const chatFormat = require('../../common/bot/helpers/global/chatFormat');
const Discord = require('discord.js');

const append = require('./helpers/append');
const create = require('./helpers/create');
const remove = require('./helpers/remove');
const list = require('./helpers/list');
const play = require('./helpers/play');

module.exports = {
    play: (message, playlistName, doShuffle = false) => {play(message, playlistName, doShuffle)},
    list: (message, playlistName) => {list.byName(message, playlistName)},
    listAll: (message) => {list.all(message)},
    create: (message, playlistName) => {create(message, playlistName)},
    delete: (message, playlistName) => {remove.playlist(message, playlistName)},
    remove: (message, playlistName, songURL) => {remove.song(message, playlistName, songURL)},
    append: (message, playlistName, songURL = null, songName = null) => {
        append(message, playlistName, songURL, songName)
            .then(song => {
                let embedMsg = new Discord.RichEmbed();
                if (song !== undefined) {
                    console.log(song);
                    embedMsg.setTitle(`${song.title}`);
                    embedMsg.setColor(chatFormat.colors.byName.green);
                    embedMsg.setThumbnail(song.thumbnail.url);
                    embedMsg.setURL(song.url);
                    embedMsg.addField(':writing_hand: Success!', `Added song to the playlist.`);
                    message.channel.send(embedMsg);
                }
                else {
                    embedMsg.setTitle(`Error`);
                    embedMsg.setColor(chatFormat.colors.byName.red);
                    embedMsg.addField(':interrobang: Oops!', 'Failed to add song to playlist.');
                    message.channel.send(embedMsg);
                }
            })
            .catch(e => console.log(e));
    }
}