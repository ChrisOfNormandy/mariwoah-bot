const add = require('./helpers/addToPlaylist');
const chatFormats = require('../../common/bot/helpers/chatFormats');
const create = require('./helpers/createPlaylist');
const Discord = require('discord.js');
const list = require('./helpers/listPlaylist');
const listDir = require('../../common/bot/helpers/listDir');
const paths = require('../../common/bot/helpers/paths');
const play = require('./helpers/playPlaylist');
const remove = require('./helpers/removeFromPlaylist');
const ytdl = require('ytdl-core');

module.exports = {
    play: function (message, playlistName, doShuffle) { play(message, playlistName, doShuffle); },
    list: function (message, playlistName, pageNumber, includeLinks) { list(message, playlistName, pageNumber, includeLinks); },
    listAll: function (message) {
        listDir(paths.getPlaylistPath(message))
            .then(list => {
                if (list.length == 0) {
                    message.channel.send('There are no created playlists.');
                    return;
                }
                let msg = '';
                for (let i = 0; i < list.length; i++)
                    msg += `${i + 1}. ${list[i].split('.')[0]}\n`;
                message.channel.send(msg);
            })
            .catch(e => console.log(e));
    },
    create: function (message, playlistName) { create(message, playlistName); },
    add: async function (message, playlistName, songURL) {
        add(message, playlistName, songURL)
            .then(result => {
                let embedMsg = new Discord.RichEmbed();
                if (result !== undefined) {
                    if (result) {
                        ytdl.getInfo(songURL, (err, info) => {
                            if (err)
                                return;
                            let arr = info.player_response.videoDetails.thumbnail.thumbnails;
                            embedMsg.setTitle(`${info.title}`);
                            embedMsg.setColor(chatFormats.colors.byName.green);
                            embedMsg.setThumbnail(arr[arr.length - 1].url);
                            embedMsg.setURL(songURL);
                            embedMsg.addField(':writing_hand: Success!', `Added song to the playlist.`);
                            message.channel.send(embedMsg);
                        });
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