const commandList = require('../common/bot/helpers/global/commandList');
const playlist = require('./playlists/adapter');
const roleManager = require('../rolemanagement/adapter');

const getEmbedSongInfo = require('./helpers/getEmbedSongInfo');

const getSong = require('./helpers/getSong');
const append = require('./helpers/queue/append');
const skip = require('./helpers/functions/skip');
const list = require('./helpers/queue/list');
const stop = require('./helpers/functions/stop');
const pause = require('./helpers/functions/pause');

const getVC = require('../common/bot/helpers/global/getVoiceChannel');

const pl = commandList.playlists.commands;

function verify(message, permissionLevel) {
    return new Promise((resolve, reject) => {
        roleManager.verifyPermission(message, message.author.id, permissionLevel)
            .then(r => resolve(r))
            .catch(e => reject(e));
    });
}

module.exports = {
    append: {
        byURL: (message, songURL) => {
            return new Promise((resolve, reject) => {
                getSong.byURL(message, songURL)
                    .then(obj => resolve(append(message, obj)))
                    .catch(e => reject(e))
            });
        },
        byURLArray: (message, songURLs, flags) => {
            return new Promise((resolve, reject) => {
                getSong.byURLArray(message, songURLs)
                    .then(arr => resolve(append(message, null, arr, flags)))
                    .catch(e => reject(e));
            });
        },
        byName: (message, songName) => {
            return new Promise((resolve, reject) => {
                getSong.byName(message, songName)
                    .then(obj => resolve(append(message, obj)))
                    .catch(e => reject(e));
            });
        }
    },
    skip,
    list,
    stop,
    join: (message) => {
        const vc = getVC(message);
        if (vc)
            vc.join();
        else
            return '> You must be in a voice channel to add bot.';
    },
    leave: (message) => {
        const vc = getVC(message);
        if (vc)
            vc.leave();
        else
            return '> You must be in a voice channel to remove bot.';
    },
    pause: (message) => {return pause.pause(message)},
    resume: (message) => {return pause.resume(message)},
    info: (message, songURL, songName) => {
        return new Promise((resolve, reject) => {
            getEmbedSongInfo.songInfo(message, songURL, songName)
                .then(embed => resolve(embed))
                .catch(e => {
                    console.log(e);
                    resolve('> Encountered error finding song information.');
                });
        });
    },

    pl_append: (message, playlistName, songURL = null, songName = null) => {return playlist.append(message, playlistName, songURL, songName)},
    pl_create: (message, playlistName) => {return playlist.create(message, playlistName)},
    pl_delete: (message, playlistName) => {return playlist.delete(message, playlistName)},
    pl_listAll: (message) => {return playlist.listAll(message)},
    pl_list: (message, playlistName) => {return playlist.list(message, playlistName)},
    pl_remove: (message, playlistName, songURL) => {return playlist.remove(message, playlistName, songURL)},
    pl_play: (message, playlistName, doShuffle = false) => {return playlist.play(message, playlistName, doShuffle)},

    playlistCommand: (message, data) => {
        const _this = this;
        const command = args[0];

        console.log('here')

        return new Promise((resolve, reject) => {
            if (command == 'play')
                verify(message, pl.play.permissionLevel)
                    .then(() => resolve(_this.pl_play(message, args[1], args[2] === '-s')))
                    .catch(r => reject(r));
            else if (command == 'list')
                verify(message, pl.list.permissionLevel)
                    .then(() => resolve((args.length == 1)
                        ? _this.pl_listAll(message)
                        : _this.pl_list(message, args[1])))
                    .catch(r => reject(r));
            else if (command == 'create')
                verify(message, pl.create.permissionLevel)
                    .then(() => resolve(_this.pl_create(message, args[1])))
                    .catch(r => reject(r));
            else if (command == 'delete')
                verify(message, pl.delete.permissionLevel)
                    .then(() => resolve(_this.pl_delete(message, args[1])))
                    .catch(r => reject(r));
            else if (command == 'add')
                verify(message, pl.add.permissionLevel)
                    .then(() => {
                        if (!args.join(' ').includes('youtube.com/watch?'))
                            resolve(_this.pl_append(message, args[1], null, args.slice(2).join(' ')));
                        else resolve(_this.pl_append(message, args[1], args[2], null));
                    })
                    .catch(r => reject(r));
            else if (command == 'remove')
                verify(message, pl.remove.permissionLevel)
                    .then(() => resolve(_this.pl_remove(message, args[1], args[2])))
                    .catch(r => reject(r));
            else reject(null);
        });
    }
}