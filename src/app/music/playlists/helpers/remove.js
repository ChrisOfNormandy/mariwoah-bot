const db = require('../../../sql/adapter');

function playlist(message, name) {
    return new Promise((resolve, reject) => {
        db.playlists.delete(message, name)
            .then(r => resolve(r))
            .catch(e => reject(e));
    });
}

function song(message, name, songURL) {
    return new Promise((resolve, reject) => {
        db.playlists.remove(message, name, songURL)
            .then(r => resolve(r))
            .catch(e => reject(e));
    });
}

module.exports = {
    playlist,
    song
}