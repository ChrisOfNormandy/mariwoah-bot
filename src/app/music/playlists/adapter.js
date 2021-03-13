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
                resolve(addSong.byURLs(message, playlistName, data.urls));
            }
            else {
                let songName = data.arguments[1];

                if (songName == 'this') {
                    if (queue.has(message.guild.id)) {
                        console.log(queue.get(message.guild.id).songs)
                        addSong.bySong(message, playlistName, queue.get(message.guild.id).songs[0])
                            .then(song => {
                                let embed = new Discord.MessageEmbed()
                                    .setTitle(`${song.title}`)
                                    .setColor(chatFormat.colors.byName.green)
                                    .setThumbnail(song.thumbnail)
                                    .setURL(song.url)
                                    .addField(':writing_hand: Success!', `Added song to the playlist.`);
                                resolve(commandFormat.valid([song], [embed]));
                            })
                            .catch(e => reject(commandFormat.error([e], [])));
                    }
                    else
                        reject(commandFormat.error([], [chatFormat.response.music.queue.no_active()]));
                }
                else {
                    addSong.byName(message, playlistName, songName)
                        .then(song => {
                            let embed = new Discord.MessageEmbed();
                            if (!!song) {
                                embed.setTitle(`${song.title}`);
                                embed.setColor(chatFormat.colors.byName.green);
                                embed.setThumbnail(song.thumbnail);
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
                        .catch(e => reject(commandFormat.error([e], [e.message])));
                }
            }
        });
    },
    delete: (message, data) => {
        const {s3} = require('../../../aws/helpers/adapter');
        return new Promise((resolve, reject) => {
            s3.object.delete('mariwoah', `guilds/${message.guild.id}/playlists/${data.arguments[0]}.json`)
                .then(res => resolve(commandFormat.valid([res], ['Deleted playlist.'])))
                .catch(err => reject(commandFormat.error([err], [err.message])));
        });
    },
    remove: (message, data) => {
        const {s3} = require('../../../aws/helpers/adapter');
        return new Promise((resolve, reject) => {
            s3.object.get('mariwoah', `guilds/${message.guild.id}/playlists/${data.arguments[0]}.json`)
                .then(res => {
                    const pl = JSON.parse(res.Body.toString());

                    for (let s in pl) {
                        const song = pl[s];

                        if (data.urls.length && data.urls.includes(song.url))
                            delete pl[s];
                        else if (data.arguments[1] == song.id)
                            delete pl[s];
                        else if (data.arguments[1] == song.title)
                            delete pl[s];
                        else if (data.arguments[1] == song.author)
                            delete pl[s];
                        // else remove by requested user
                    }

                    s3.object.putData('mariwoah', `guilds/${message.guild.id}/playlists`, {
                        name: `${data.arguments[0]}.json`,
                        type: `application/json`,
                        data: pl
                    })
                    .then(res => resolve(commandFormat.valid([], ["Wow."])))
                    .catch(err => reject(commandFormat.error([err], [err.message])));
                })
                .catch(err => reject(commandFormat.error([err], [err.message])));
        });
    },
    setVisibility: require('./helpers/setVisibility')
}