const commandList = require('../common/bot/helpers/global/commandList');
const playlist = require('./playlists/adapter');
const roleManager = require('../rolemanagement/adapter');
const chatFormat = require('../common/bot/helpers/global/chatFormat');

const getEmbedSongInfo = require('./helpers/getEmbedSongInfo');

const getSong = require('./helpers/getSong');
const append = require('./helpers/queue/append');
const skip = require('./helpers/functions/skip');
const list = require('./helpers/queue/list');
const stop = require('./helpers/functions/stop');
const pause = require('./helpers/functions/pause');

const getVC = require('../common/bot/helpers/global/getVoiceChannel');
const shuffle = require('../common/bot/helpers/global/shuffle');

const pl = commandList.music.commands.playlist.subcommands;

function verify(message, permissionLevel) {
    return new Promise((resolve, reject) => {
        roleManager.verifyPermission(message, message.author.id, permissionLevel)
            .then(r => resolve(r))
            .catch(e => reject(e));
    });
}

function join(message) {
    const vc = getVC(message);
    if (vc)
        vc.join();
    else
        return {value: chatFormat.response.music.no_vc()};
}

function leave(message) {
    const vc = getVC(message);
    if (vc)
        vc.leave();
    else
        return {value: chatFormat.response.music.no_vc()};
}

function info(message, data) {
    return new Promise((resolve, reject) => {
        getEmbedSongInfo.songInfo(message, data)
            .then(embed => resolve({embed}))
            .catch(e => {
                console.log(e);
                resolve({value: chatFormat.response.music.info.error()});
            });
    });
}

function pl_append(message, data) {
    return playlist.append(message, data)
}
function pl_create(message, playlistName) {
    return playlist.create(message, playlistName)
}
function pl_delete(message, playlistName) {
    return playlist.delete(message, playlistName)
}
function pl_listAll(message) {
    return playlist.listAll(message)
}
function pl_list(message, playlistName) {
    return playlist.list(message, playlistName)
}
function pl_remove(message, playlistName, songURL) {
    return playlist.remove(message, playlistName, songURL)
}
function pl_play(message, data) {
    return playlist.play(message, data)
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
        byURLArray: (message, songURLs, data) => {
            return new Promise((resolve, reject) => {
                getSong.byURLArray(message, songURLs)
                    .then(arr => {
                        if (data.flags['s']) {
                            shuffle(arr)
                                .then(arr_ => resolve(append(message, null, arr_, data.flags)))
                                .catch(e => reject(e));
                        }
                        else
                            resolve(append(message, null, arr, data.flags))
                    })
                    .catch(e => reject(e));
            });
        },
        byName: (message, data) => {
            return new Promise((resolve, reject) => {
                getSong.byName(message, data.arguments.join(' '), data)
                    .then(obj => resolve(append(message, obj)))
                    .catch(e => reject(e));
            });
        },
        byPlaylist: (message, data) => {
            return new Promise((resolve, reject) => {
                getSong.byPlaylist(message, data.arguments.join(' '), data)
                    .then(arr => {
                        if (data.flags['s']) {
                            shuffle(arr)
                                .then(arr_ => resolve(append(message, null, arr_, data.flags)))
                                .catch(e => reject(e));
                        }
                        else
                            resolve(append(message, null, arr, data.flags))
                    })
                    .catch(e => reject(e));
            });
        }
    },
    skip,
    list,
    stop,
    join,
    leave,
    pause: (message) => { return pause.pause(message) },
    resume: (message) => { return pause.resume(message) },
    info,

    pl_append,
    pl_create,
    pl_delete,
    pl_listAll,
    pl_list,
    pl_remove,
    pl_play,

    playlistCommand: (message, data) => {
        const command = (data.arguments.length) ? data.arguments[0] : '';

        return new Promise((resolve, reject) => {
            if (!pl[command].permissionLevel)
                reject(null);
            else {
                verify(message, pl[command].permissionLevel)
                switch (command) {
                    case 'play': {
                        resolve(pl_play(message, data))
                        break;
                    }
                    case 'list': {
                        if (!data.arguments[1])
                            resolve(pl_listAll(message));
                        else
                            resolve(pl_list(message, data.arguments[1]));
                        break;
                    }
                    case 'create': {
                        resolve(pl_create(message, data.arguments[1]));
                        break;
                    }
                    case 'add': {
                        resolve(pl_append(message, data));
                        break;
                    }
                    case 'delete': {
                        resolve(pl_delete(message, data.arguments[1]))
                        break;
                    }
                    case 'remove': {
                        resolve(pl_remove(message, data.arguments[1], data.urls[0]))
                    }
                    default: {
                        reject(null);
                        break;
                    }
                }
            }
        });
    }
}