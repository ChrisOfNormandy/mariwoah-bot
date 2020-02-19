const add = require('./helpers/addToPlaylist');
const chatFormats = require('../../common/bot/helpers/chatFormats');
const create = require('./helpers/createPlaylist');
const Discord = require('discord.js');
const getJsonFromFile = require('../../common/bot/helpers/getJsonFromFile');
const list = require('./helpers/listPlaylist');
const listDir = require('../../common/bot/helpers/listDir');
const paths = require('../../common/bot/helpers/paths');
const play = require('./helpers/playPlaylist');
const remove = require('./helpers/removeFromPlaylist');
const ytdl = require('ytdl-core');

function _list(embedMsg, path, list, index) {
    return new Promise(function (resolve, reject) {
        if (index >= list.length)
            resolve(embedMsg);

        getJsonFromFile(path + list[index])
            .then(obj => {
                embedMsg.addField(`${list[index].split('.')[0]}`, `${obj.playlist.length} songs.`);
            })
            .then(() => {
                resolve(_list(embedMsg, path, list, index + 1));
            })
            .catch(e => reject(e));
    });
}

module.exports = {
    play: function (message, playlistName, doShuffle) { play(message, playlistName, doShuffle); },
    list: function (message, playlistName, pageNumber, includeLinks) { list(message, playlistName, pageNumber, includeLinks); },
    listAll: function (message) {
        let path = paths.getPlaylistPath(message);
        listDir(path)
            .then(list => {
                let embedMsg = new Discord.RichEmbed()
                    .setTitle('Available playlists')
                    .setColor(chatFormats.colors.information);
                if (!list.length) {
                    embedMsg.addField('No playlists.', 'Add a playlist using ~playlist create {name}.');
                    return;
                }
                _list(embedMsg, path, list, 0)
                    .then(msg => message.channel.send(msg))
                    .catch(e => console.log(e));
            })
            .catch(e => console.log(e));
    },
    create: function (message, playlistName) { create(message, playlistName); },
    add: async function (message, playlistName, songURL = null, songName = null) {
        add(message, playlistName, songURL, songName)
            .then(song => {
                let embedMsg = new Discord.RichEmbed();
                if (song !== undefined) {
                    embedMsg.setTitle(`${song.title}`);
                    embedMsg.setColor(chatFormats.colors.byName.green);
                    embedMsg.setThumbnail(song.thumbnail.url);
                    embedMsg.setURL(song.url);
                    embedMsg.addField(':writing_hand: Success!', `Added song to the playlist.`);
                    message.channel.send(embedMsg);
                }
                else {
                    embedMsg.setTitle(`Error`);
                    embedMsg.setColor(chatFormats.colors.byName.red);
                    embedMsg.addField(':interrobang: Oops!', 'Failed to add song to playlist.');
                    message.channel.send(embedMsg);
                }
                try {
                    message.delete();
                }
                catch (e) {
                    message.channel.send('I require admin permissions to operate correctly.');
                }
            })
            .catch(e => {
                if (e.message)
                    message.channel.send(e.message);
                else
                    message.channel.send(e);
                try {
                    message.delete();
                }
                catch (e) {
                    message.channel.send('I require admin permissions to operate correctly.');
                }
            });
    },
    remove: async function (message, playlistName, index) {
        let result = await remove(message, playlistName, index);
        message.channel.send((result) ? 'Removed song from the playlist!' : 'Failed to remove song from playlist');
        try {
            message.delete();
        }
        catch (e) {
            message.channel.send('I require admin permissions to operate correctly.');
        }
    }
}