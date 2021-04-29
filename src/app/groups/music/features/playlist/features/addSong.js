const { s3 } = require('../../../../../../aws/helpers/adapter');

const getSongObject = require('../../../helpers/getSong');

function byName(message, playlistName, songName) {
    return new Promise((resolve, reject) => {
        getSongObject.byName(message, songName)
            .then(song => {
                s3.object.get('mariwoah', `guilds/${message.guild.id}/playlists/${playlistName}.json`)
                    .then(obj => {
                        let list = JSON.parse(obj.Body.toString());

                        if (!!list[song.id])
                            reject({message: 'Playlist already contains value.'});
                        else {
                            list[song.id] = song;

                            s3.object.putData('mariwoah', `guilds/${message.guild.id}/playlists`, {
                                name: `${playlistName}.json`,
                                type: 'application/json',
                                data: list
                            })
                                .then(res => resolve(list))
                                .catch(err => reject(err));
                        }
                    })
                    .catch(err => {
                        console.error(err)
                        let file = {
                            name: `${playlistName}.json`,
                            type: 'application/json',
                            data: {}
                        };
                        file.data[songName] = song;

                        s3.object.putData('mariwoah', `guilds/${message.guild.id}/playlists`, file)
                            .then(res => resolve(file.data))
                            .catch(err => reject(err));
                    });
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
                    addSongPromiseArray.push(sql.playlists.addSong(message.guild.id, message, author.id, playlistName, songs[i].url, songs[i]));

                Promise.all(addSongPromiseArray)
                    .then(r => resolve(r))
                    .catch(e => reject(e));
            })
            .catch(e => reject(e));
    });
}

function bySong(message, playlistName, song) {
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