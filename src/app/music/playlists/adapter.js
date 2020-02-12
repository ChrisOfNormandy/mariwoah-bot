const add = require('./helpers/addToPlaylist');
const create = require('./helpers/createPlaylist');
const Discord = require('discord.js');
const list = require('./helpers/listPlaylist');
const listDir = require('../../common/bot/helpers/listDir');
const paths = require('../../common/bot/helpers/paths');
const play = require('./helpers/playPlaylist');
const remove = require('./helpers/removeFromPlaylist');
const ytdl = require('ytdl-core');

module.exports = {
    play: function (message, playlistName, doShuffle) { play(message, playlistName, doShuffle) },
    list: function (message, playlistName, includeLinks) { list(message, playlistName, includeLinks) },
    listAll: function (message) {
        listDir(paths.getPlaylistPath(message))
            .then(list => {
                if (list.length == 0) {
                    message.channel.send('There are no created playlists.');
                    return;
                }
                let msg = '';
                for (let i  = 0; i < list.length; i++)
                    msg += `${i + 1}. ${list[i].split('.')[0]}\n`;
                message.channel.send(msg);
            })
            .catch(e => console.log(e));
    },
    create: function (message, playlistName) { create(message, playlistName) },
    add: async function (message, playlistName, songURL) {
        add(message, playlistName, songURL)
            .then(result => {
                let embedMsg = new Discord.RichEmbed()
                    .setColor('#990011');
                if (result !== undefined) {
                    
                    if(result) {
                        ytdl.getInfo(songURL, (err, info) => {
                            let arr = info.player_response.videoDetails.thumbnail.thumbnails;
                            console.log(arr[arr.length - 1]);
                            embedMsg.setTitle(`${info.title}`)
                            embedMsg.setThumbnail(arr[arr.length - 1].url);
                            embedMsg.setURL(songURL);
                            embedMsg.addField(':writing_hand: Success!', `Added song to the playlist.`);
                            message.channel.send(embedMsg);
                        });
                    }
                    else {
                        embedMsg.addField(':interrobang:', 'Failed to add song to playlist.');
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