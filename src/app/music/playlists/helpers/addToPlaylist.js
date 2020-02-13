const fs = require('fs');
const paths = require('../../../common/bot/helpers/paths');
const ytdl = require('ytdl-core');

module.exports = async function (message, playlistName, songURL) {
    return new Promise(async function (resolve, reject) {
        ytdl.getInfo(songURL)
            .then(async (songInfo) => {
                const song = {
                    title: songInfo.title,
                    url: songInfo.video_url                };

                fs.readFile(paths.getPlaylistPath(message) + playlistName + '.json', 'utf8', (err, data) => {
                    if (err)
                        reject(err);
                    else {
                        let obj = (!data) ? { "playlist": [] } : JSON.parse(data);

                        for (let i in obj.playlist) {
                            if (obj.playlist[i].url == songURL)
                                reject('Playlist already contains that song.');
                        }

                        obj.playlist.push(song);

                        json = JSON.stringify(obj);
                        
                        fs.writeFile(`${paths.getPlaylistPath(message)}${playlistName}.json`, json, 'utf8', (err) => {
                            if (err)
                                reject(err);
                            else
                                resolve(true);
                        });
                    }
                });
            })
            .catch(e => reject(e))
    })

}