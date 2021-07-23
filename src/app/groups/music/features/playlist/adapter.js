const { chatFormat, output } = require('../../../../helpers/commands');
const Discord = require('discord.js');

const addSong = require('./features/addSong');
const queue = require('../queue/map');

module.exports = {
    play: require('./features/play'),
    list: require('./features/list'),
    create: require('./features/create'),
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
                        addSong.bySong(message, playlistName, queue.get(message.guild.id).songs[0])
                            .then(song => {
                                let embed = new Discord.MessageEmbed()
                                    .setTitle(`${song.title}`)
                                    .setColor(chatFormat.colors.byName.green)
                                    .setThumbnail(song.thumbnail)
                                    .setURL(song.url)
                                    .addField(':writing_hand: Success!', `Added song to the playlist.`);
                                resolve(output.valid([song], [embed]));
                            })
                            .catch(e => reject(output.error([e], [])));
                    }
                    else
                        reject(output.error([], [chatFormat.response.music.queue.no_active()]));
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
                                resolve(output.valid([song], [embed]));
                            }
                            else {
                                embed.setTitle(`Error`);
                                embed.setColor(chatFormat.colors.byName.red);
                                embed.addField(':interrobang: Oops!', 'Failed to add song to playlist.');
                                resolve(output.valid([], [embed]));
                            }
                        })
                        .catch(e => reject(output.error([e], [e.message])));
                }
            }
        });
    },
    delete: (message, data) => {
        const { s3 } = require('../../../../../aws/helpers/adapter');
        return new Promise((resolve, reject) => {
            s3.object.delete('mariwoah', `guilds/${message.guild.id}/playlists/${data.arguments[0]}.json`)
                .then(res => resolve(output.valid([res], ['Deleted playlist.'])))
                .catch(err => reject(output.error([err], [err.message])));
        });
    },
    remove: (message, data) => {
        const { s3 } = require('../../../../../aws/helpers/adapter');
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

                    s3.object.putData('mariwoah', `guilds/${message.guild.id}/playlists`, `${data.arguments[0]}.json`, JSON.stringify(pl))
                        .then(res => resolve(output.valid([res], ["Wow."])))
                        .catch(err => reject(output.error([err], [err.message])));
                })
                .catch(err => reject(output.error([err], [err.message])));
        });
    },
    setVisibility: require('./features/setVisibility')
};