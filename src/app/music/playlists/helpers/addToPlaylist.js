const getSongObject = require('../../general/helpers/getSongObject');
const paths = require('../../../common/bot/helpers/global/paths');
const readFile = require('../../../common/bot/helpers/files/readFile');
const writeFile = require('../../../common/bot/helpers/files/writeFile');

function writeToFile(message, playlistName, song) {
    return new Promise(function (resolve, reject) {
        readFile(`${paths.getPlaylistPath(message)}${playlistName}.json`)
            .then(r => {
                let obj = (r === null) ? { "playlist": [] } : r;

                for (let i in obj.playlist) {
                    if (obj.playlist[i].url == song.url) {
                        reject('Playlist already contains song.');
                        return;
                    }
                }

                let songToWrite = {
                    title: song.title,
                    url: song.url,
                    duration: song.duration.totalSeconds,
                    thumbnail: song.thumbnail.url
                }
                obj.playlist.push(songToWrite);

                writeFile(`${paths.getPlaylistPath(message)}${playlistName}.json`, obj)
                    .then(r => resolve(r))
                    .catch(e => reject(e));
            })
            .catch(e => reject(e));
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