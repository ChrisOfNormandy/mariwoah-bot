const db = require('../../../sql/adapter');
const getSongObject = require('../../helpers/getSong');

function byName(message, playlistName, songName) {
    return new Promise((resolve, reject) => {
        getSongObject.byName(message, songName)
            .then(song => {
                db.playlists.append(message, playlistName, song)
                    .then(r => resolve(song))
                    .catch(e => reject(e));
            })
            .catch(e => reject(e));
    });
}

function byURLs(message, playlistName, urls) {

    let arr = [];
    for (let i in urls) {
        arr.push(getSongObject.byUrl(message, urls[i]));
    }
    return new Promise((resolve, reject) => {
        Promise.all(arr)
            .then(results => {
                let arr_
                for (let i in results) {
                    arr_.push(db.playlists.append(message, playlistName, results[i]))
                }
                Promise.all(arr_)
                    .then(r => resolve(results))
                    .catch(e => reject(e));
            })
            .catch(e => reject(e));
    });
}

function bySong(message, playlistName, song) {
    return new Promise((resolve, reject) => {
        db.playlists.append(message, playlistName, song)
            .then(r => resolve(song))
            .catch(e => reject(e));
    });
}

module.exports = {
    byName,
    byURLs,
    bySong
}