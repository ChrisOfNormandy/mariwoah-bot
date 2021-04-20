const sql = require('../../../sql/adapter');

function playlist(message, name) {
    return new Promise((resolve, reject) => {
        sql.playlists.delete(message, name)
            .then(r => resolve(r))
            .catch(e => reject(e));
    });
}

function song(message, name, songURL) {
    return new Promise((resolve, reject) => {
        sql.playlists.remove(message, name, songURL)
            .then(r => resolve(r))
            .catch(e => reject(e));
    });
}

module.exports = {
    playlist,
    song
}