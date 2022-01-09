const getSong = require('../../helpers/getSong');
const append = require('./append');
const { handlers } = require('@chrisofnormandy/mariwoah-bot');
const { shuffle } = handlers.arrays;

function byName(message, data) {
    return new Promise((resolve, reject) => {
        getSong.byName(message, data.arguments.join(' '), data)
            .then((song) => resolve(append(message, [song], data.flags)))
            .catch((e) => reject(e));
    });
}

function byURLArray(message, data) {
    return new Promise((resolve, reject) => {
        getSong.byURLArray(message, data.urls)
            .then((arr) => {
                if (data.flags.has('s')) {
                    shuffle(arr)
                        .then((arr_) => resolve(append(message, arr_, data.flags)))
                        .catch((e) => reject(e));
                }
                else
                    resolve(append(message, arr, data.flags));
            })
            .catch((e) => reject(e));
    });
}

function byPlaylist(message, data) {
    return new Promise((resolve, reject) => {
        getSong.byPlaylist(message, data.arguments.join(' '), data)
            .then((playlistData) => resolve(append(message, playlistData, data.flags)))
            .catch((e) => reject(e));
    });
}

module.exports = (message, data) => {
    if (data.urls.length)
        return byURLArray(message, data);

    return (data.flags.p)
        ? byPlaylist(message, data)
        : byName(message, data);
};