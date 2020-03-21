const db = require('../../../sql/adapter');
const getSongObject = require('../../helpers/getSong');

module.exports = function (message, playlistName, songURL = null, songName = null) {
    return new Promise(function (resolve, reject) {
        if (songURL == null && songName == null)
            reject(null);
        else if (songURL !== null) {
            getSongObject.byUrl(message, songURL)
                .then(song => {
                    db.playlists.append(message, playlistName, song);
                    resolve(song);
                });
        }
        else {
            getSongObject.byName(message, songName)
                .then(song => {
                    db.playlists.append(message, playlistName, song);
                    resolve(song);
                });
        }
    });
}