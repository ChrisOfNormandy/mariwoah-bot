const ytSearch = require('yt-search');
const chatFormat = require('../../common/bot/helpers/global/chatFormat');
const shuffle = require('../../common/bot/helpers/global/shuffle');

function formatSongData(message, songData, playlistData = null) {
    let obj = {
        title: songData.title,
        url: (songData.url) ? songData.url : `https://www.youtube.com/watch?v=${songData.videoId}`,
        id: songData.videoId,
        author: songData.author.name,
        requested: message.author,
        duration: {},
        playlist: {},
        thumbnail: songData.thumbnail || songData.thumbnailUrl,
        removed: false
    }
    if (songData.duration) {
        obj.duration = {
            timestamp: songData.duration.timestamp,
            seconds: songData.duration.seconds
        };
    }
    if (playlistData) {
        obj.playlist = {
            title: playlistData.title,
            url: playlistData.url,
            videoCount: playlistData.videos.length,
        }
    }

    return obj;
}

function search(name, timeOut = 0) {
    return new Promise((resolve, reject) => {
        ytSearch(name, (err, data) => {
            if (err)
                reject(err);
            else {
                if (timeOut > 10) {
                    reject(chatFormat.response.music.timeout(name));
                }
                else {
                    if (data.videos.length)
                        resolve(data);
                    else
                        resolve(search(name, timeOut++));
                }
            }
        });
    });
}

function metaSearch_pl(listId, timeOut = 0) {
    return new Promise((resolve, reject) => {
        ytSearch({ listId }, (err, data) => {
            if (err)
                reject(err);
            else {
                if (timeOut > 10) {
                    reject(chatFormat.response.music.timeout('playlist id ' + metadata));
                }
                else {
                    if (data.videos.length)
                        resolve(data);
                    else
                        resolve(metaSearch_pl(metadata, timeOut++));
                }
            }
        });
    });
}

function metaSearch(metadata, timeOut = 0) {
    return new Promise((resolve, reject) => {
        ytSearch({ videoId: metadata }, (err, data) => {
            if (err)
                reject(err)
            else {
                if (timeOut > 10) {
                    reject(chatFormat.response.music.timeout('song id ' + metadata));
                }
                else {
                    if (data)
                        resolve(data);
                    else
                        resolve(metaSearch(metadata), timeOut++);
                }
            }
        });
    });
}

module.exports = {
    byURL: async function (message, songURL) {
        return new Promise((resolve, reject) => {
            metaSearch(songURL.match(/\?v=([a-zA-Z0-9\-_]+)/)[1])
                .then(songData => {
                    resolve(formatSongData(message, songData));
                })
                .catch(e => reject(e));
        });
    },
    byURLArray: function (message, urlArray) {
        return new Promise((resolve, reject) => {
            let arr = [];
            for (let i in urlArray)
                arr.push(this.byURL(message, urlArray[i]));

            Promise.all(arr)
                .then(songs => resolve(songs))
                .catch(e => reject(e));
        });
    },
    byName: function (message, songName) {
        return new Promise((resolve, reject) => {
            search(songName)
                .then(songData => {
                    const videos = songData.videos;
                    resolve(formatSongData(message, videos[0]));
                })
                .catch(e => reject(e));
        });
    },
    byPlaylist: function (message, playlistName, data, index = 0) {
        return new Promise((resolve, reject) => {
            message.channel.send(chatFormat.response.music.getSong.playlist())
                .then(msg => {
                    search(playlistName)
                        .then(songData => {
                            const playlists = songData.playlists;
                            if (index >= playlists.length)
                                reject(null);
                            else {
                                metaSearch_pl(playlists[index].listId)
                                    .then(pl => {
                                        msg.edit(chatFormat.response.music.getSong.playlist_result(pl));
                                        const videos = pl.videos;

                                        if (data.flags['s']) {
                                            shuffle(videos)
                                                .then(list => {   
                                                    let arr = [];
                                                    for (let i in list)
                                                        arr.push(formatSongData(message, list[i], pl));
                                                    resolve(arr);
                                                })
                                                .catch(e => reject(e));
                                        }
                                        else {
                                            let arr = [];
                                            for (let i in videos)
                                                arr.push(formatSongData(message, videos[i], pl));
                                            resolve(arr);
                                        }
                                    })
                                    .catch(e => {
                                        msg.edit(chatFormat.response.music.getSong.playlist_undefined(playlists[index].listId));
                                        this.byPlaylist(message, playlistName, data, index + 1)
                                        .then(r => resolve(r))
                                        .catch(e => reject(e));
                                    });
                                }
                        })
                        .catch(e => reject(e));
                });
        })
    }
}