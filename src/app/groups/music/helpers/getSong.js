const Discord = require('discord.js');
const ytSearch = require('yt-search');
const { MessageData, handlers, Output } = require('@chrisofnormandy/mariwoah-bot');

const { shuffle } = handlers.arrays;

/**
 * 
 * @param {Discord.Message} message 
 * @param {*} songData 
 * @param {*} playlistData 
 * @returns 
 */
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
    };

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
        };
    }

    return obj;
}

/**
 * 
 * @param {string} name 
 * @param {number} timeOut 
 * @returns {Promise<>}
 */
function search(name, timeOut = 0) {
    return new Promise((resolve, reject) => {
        ytSearch(name, (err, data) => {
            if (err)
                reject(err);
            else {
                if (timeOut > 10) {
                    reject(name);
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

/**
 * 
 * @param {*} listId 
 * @param {*} timeOut 
 * @returns 
 */
function metaSearch_pl(listId, timeOut = 0) {
    return new Promise((resolve, reject) => {
        ytSearch({ listId }, (err, data) => {
            if (err)
                reject(err);
            else {
                if (timeOut > 10) {
                    reject(metadata);
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

/**
 * 
 * @param {*} metadata 
 * @param {*} timeOut 
 * @returns 
 */
function metaSearch(metadata, timeOut = 0) {
    return new Promise((resolve, reject) => {
        ytSearch({ videoId: metadata }, (err, data) => {
            if (err)
                reject(err);
            else {
                if (timeOut > 10) {
                    reject(metadata);
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
    /**
     * 
     * @param {Discord.Message} message 
     * @param {*} songURL 
     * @returns 
     */
    byURL: function (message, songURL) {
        return new Promise((resolve, reject) => {
            metaSearch(songURL.match(/\?v=([a-zA-Z0-9\-_]+)/)[1])
                .then(songData => {
                    resolve(formatSongData(message, songData));
                })
                .catch(e => reject(e));
        });
    },

    /**
     * 
     * @param {Discord.Message} message 
     * @param {*} urlArray 
     * @returns 
     */
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

    /**
     * 
     * @param {Discord.Message} message 
     * @param {*} songName 
     * @returns 
     */
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

    /**
     * 
     * @param {Discord.Message} message 
     * @param {string} playlistName 
     * @param {MessageData} data 
     * @param {number} index 
     * @returns 
     */
    byPlaylist: function (message, playlistName, data, index = 0) {
        return new Promise((resolve, reject) => {
            message.channel.send('Playing playlist.')
                .then(msg => {
                    search(playlistName)
                        .then(songData => {
                            const playlists = songData.playlists;
                            if (index >= playlists.length)
                                reject(null);
                            else {
                                metaSearch_pl(playlists[index].listId)
                                    .then(pl => {
                                        msg.edit(pl);
                                        const videos = pl.videos;

                                        if (data.flags.has('s')) {
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
                                        msg.edit(playlists[index].listId);
                                        this.byPlaylist(message, playlistName, data, index + 1)
                                            .then(r => resolve(r))
                                            .catch(e => reject(e));
                                    });
                            }
                        })
                        .catch(e => reject(e));
                });
        });
    }
};