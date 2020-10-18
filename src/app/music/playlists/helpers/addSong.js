const sql = require('../../../sql/adapter');
const getSongObject = require('../../helpers/getSong');

function byName(message, playlistName, songName) {
    return new Promise((resolve, reject) => {
        getSongObject.byName(message, songName)
            .then(song => {
                sql.playlists.addSong(message.guild.id, message.author.id, playlistName, song.url, song)
                    .then(r => resolve(song))
                    .catch(e => reject(e));
            })
            .catch(e => reject(e));
    });
}

function byURLs(message, playlistName, urls) {
    let promiseArray = [];
    for (let i in urls)
        promiseArray.push(getSongObject.byUrl(message, urls[i]));

    return new Promise((resolve, reject) => {
        Promise.all(promiseArray)
            .then(songs => {
                let addSongPromiseArray = [];
                for (let i in songs)
                    addSongPromiseArray.push(sql.playlists.addSong(message.guild.id, message,author.id, playlistName, songs[i].url, songs[i]));

                Promise.all(addSongPromiseArray)
                    .then(r => resolve(r))
                    .catch(e => reject(e));
            })
            .catch(e => reject(e));
    });
}

function bySong(message, playlistName, song) {
    console.log(song);
    return new Promise((resolve, reject) => {
        sql.playlists.addSong(message.guild.id, message.author.id, playlistName, song.url, song)
            .then(r => resolve(song))
            .catch(e => reject(e));
    });
}

module.exports = {
    byName,
    byURLs,
    bySong
}