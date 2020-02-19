const fs = require('fs');
const getSongObject = require('../../general/helpers/getSongObject');
const paths = require('../../../common/bot/helpers/paths');

function writeToFile(message, playlistName, song) {
    return new Promise(function (resolve, reject) {
        console.log(song);
        fs.readFile(paths.getPlaylistPath(message) + playlistName + '.json', 'utf8', (err, data) => {
            if (err)
                reject(err);
            else {
                let obj = (!data) ? { "playlist": [] } : JSON.parse(data);

                for (let i in obj.playlist) {
                    if (obj.playlist[i].url == song.url) {
                        reject('Playlist already contains that song.');
                        return;
                    }
                }

                obj.playlist.push(song);

                json = JSON.stringify(obj);

                fs.writeFile(`${paths.getPlaylistPath(message)}${playlistName}.json`, json, 'utf8', (err) => {
                    if (err)
                        reject(err);
                    else
                        resolve(song);
                });
            }
        });
    });
}

module.exports = async function (message, playlistName, songURL = null, songName = null) {
    return new Promise(async function (resolve, reject) {
        if (songURL == null && songName == null)
            reject(null);
        else if (songURL !== null) {
            getSongObject.byUrl(message, songURL)
                .then(song => {
                    writeToFile(message, playlistName, song)
                        .then(r => resolve(r))
                        .catch(e => reject(e));
                });
        }
        else {
            getSongObject.byName(message, songName)
                .then(song => {
                    writeToFile(message, playlistName, song)
                        .then(r => resolve(r))
                        .catch(e => reject(e));
                });
        }
    });
}