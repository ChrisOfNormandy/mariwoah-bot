const playlist = require('./playlists/adapter');
const chatFormat = require('../common/bot/helpers/global/chatFormat');
const commandFormat = require('../common/bot/helpers/global/commandFormat');

const getEmbedSongInfo = require('./helpers/getEmbedSongInfo');

const getSong = require('./helpers/getSong');
const append = require('./helpers/queue/append');
const skip = require('./helpers/functions/skip');
const list = require('./helpers/queue/list');
const stop = require('./helpers/functions/stop');
const pause = require('./helpers/functions/pause');
const join = require('./helpers/functions/join');
const leave = require('./helpers/functions/leave');
const download = require('./helpers/functions/download');

const shuffle = require('../common/bot/helpers/global/shuffle');

function info(message, data) {
    return new Promise((resolve, reject) => {
        getEmbedSongInfo.songInfo(message, data)
            .then(embed => resolve(commandFormat.valid([embed], [embed])))
            .catch(e => reject(commandFormat.error([e], [chatFormat.response.music.info.error()])));
    });
}

function addSong(message, data) {
    if (data.urls.length)
        return byURLArray(message, data);
    return (data.flags['p'])
        ? byPlaylist(message, data)
        : byName(message, data);
}

function byName(message, data) {
    return new Promise((resolve, reject) => {
        getSong.byName(message, data.arguments.join(' '), data)
            .then(song => resolve(append(message, [song])))
            .catch(e => reject(e));
    });
}

function byURLArray(message, data) {
    return new Promise((resolve, reject) => {
        getSong.byURLArray(message, data.urls)
            .then(arr => {
                if (data.flags['s']) {
                    shuffle(arr)
                        .then(arr_ => resolve(append(message, arr_, data.flags)))
                        .catch(e => reject(e));
                }
                else
                    resolve(append(message, arr, data.flags))
            })
            .catch(e => reject(e));
    });
}

function byPlaylist(message, data) {
    return new Promise((resolve, reject) => {
        getSong.byPlaylist(message, data.arguments.join(' '), data)
            .then(playlistData => resolve(append(message, playlistData, data.flags)))
            .catch(e => reject(e));
    });
}

module.exports = {
    voiceChannel: {
        join,
        leave
    },
    queue: {
        skip,
        list,
        stop,
        pause: (message) => { return pause.pause(message) },
        resume: (message) => { return pause.resume(message) },
        addSong
    },
    song: {
        info,
        download,
    },
    playlist: (message, data) => {
        switch (data.subcommand) {
            case 'play': return playlist.play(message, data);
            case 'list': return playlist.list(message.guild.id, data.arguments.length ? data.arguments[0] : null);
            case 'create':  return playlist.create(message, data.arguments[0]);
            case 'add': return playlist.addSong(message, data);
            case 'delete': return playlist.delete(message, data);
            case 'remove': return playlist.remove(message, data);
            case 'access': return playlist.setVisibility(message.guild.id, data.arguments[0], !!data.flags['p']);
        }
    }
}