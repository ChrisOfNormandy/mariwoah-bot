const ytSearch = require('yt-search');
const SongData = require('./SongData');

const { handlers, Output } = require('@chrisofnormandy/mariwoah-bot');
const PlaylistData = require('./PlaylistData');

const { shuffle } = handlers.arrays;

/**
 * 
 * @param {Discord.Message} message 
 * @param {ytSearch.SearchResult} songData 
 * @param {ytSearch.PlaylistMetadataResult} playlistData 
 * @returns 
 */
function formatSongData(message, songData, playlistData = null) {
    let sd = new SongData(songData)
        .setRequestedBy(message.author);

    if (playlistData)
        sd.setPlaylist(playlistData.title, playlistData.url, playlistData.videoCount);

    return sd;
}

function formatPlaylistData(message, playlistData) {
    let pd = new PlaylistData(playlistData)
        .setRequestedBy(message.author);

    return pd;
}

/**
 * 
 * @param {string} name 
 * @param {number} timeOut 
 * @returns {Promise<ytSearch.SearchResult>}
 */
function search(name, timeOut = 0) {
    return new Promise((resolve, reject) => {
        ytSearch(name, (err, data) => {
            if (err)
                reject(err);
            else {
                if (timeOut > 10)
                    reject(name);
                else {
                    if (data.videos.length)
                        resolve(data);
                    else {
                        search(name, timeOut++)
                            .then((r) => resolve(r))
                            .catch((err) => reject(err));
                    }
                }
            }
        });
    });
}

/**
 * 
 * @param {string} listId 
 * @param {number} timeOut 
 * @returns {Promise<ytSearch.PlaylistMetadataResult>}
 */
function metaSearch_pl(listId, timeOut = 0) {
    return new Promise((resolve, reject) => {
        ytSearch({ listId }, (err, data) => {
            if (err)
                reject(err);
            else {
                if (timeOut > 10)
                    reject(listId);
                else {
                    if (data.videos.length)
                        resolve(data);
                    else {
                        metaSearch_pl(listId, timeOut++)
                            .then((r) => resolve(r))
                            .catch((err) => reject(err));
                    }
                }
            }
        });
    });
}

/**
 * 
 * @param {string} metadata 
 * @param {number} timeOut 
 * @returns {Promise<ytSearch.VideoMetadataResult>}
 */
function metaSearch(metadata, timeOut = 0) {
    return new Promise((resolve, reject) => {
        ytSearch({ videoId: metadata }, (err, data) => {
            if (err)
                reject(err);
            else {
                if (timeOut > 10)
                    reject(metadata);
                else {
                    if (data)
                        resolve(data);
                    else {
                        metaSearch(metadata, timeOut++)
                            .then((r) => resolve(r))
                            .catch((err) => reject(err));
                    }
                }
            }
        });
    });
}

module.exports = {
    /**
     * 
     * @param {Discord.Message} message 
     * @param {string} songURL 
     * @returns {Promise<SongData | PlaylistData>}
     */
    byURL(message, songURL) {
        return new Promise((resolve, reject) => {
            let match = songURL.match(/\?v=([^&#]]+)/);
            if (match) {
                metaSearch(match[1])
                    .then((songData) => resolve(formatSongData(message, songData)))
                    .catch((err) => reject(err));
            }
            else {
                match = songURL.match(/playlist\?list=([^&#]+)/);
                if (match) {
                    metaSearch_pl(match[1])
                        .then((plData) => resolve(formatPlaylistData(message, plData)))
                        .catch((err) => reject(err));
                }
                else
                    reject(new Output().setError(new Error('Failed to find song by URL. Check format?')));
            }
        });
    },

    /**
     * 
     * @param {Discord.Message} message 
     * @param {string[]} urlArray 
     * @returns {Promise<SongData[]>}
     */
    byURLArray(message, urlArray) {
        return new Promise((resolve, reject) => {
            Promise.all(urlArray.map((url) => this.byURL(message, url)))
                .then((songs) => resolve(songs))
                .catch((err) => reject(err));
        });
    },

    /**
     * 
     * @param {Discord.Message} message 
     * @param {string} songName 
     * @returns {Promise<SongData>}
     */
    byName(message, songName) {
        return new Promise((resolve, reject) => {
            search(songName)
                .then((songData) => resolve(formatSongData(message, songData.videos[0])))
                .catch((err) => reject(err));
        });
    },

    /**
     * 
     * @param {Discord.Message} message 
     * @param {string} playlistName 
     * @param {MessageData} data 
     * @param {number} index 
     * @returns {Promise<SongData[]>}
     */
    byPlaylist(message, playlistName, data, index = 0) {
        return new Promise((resolve, reject) => {
            message.channel.send('Playing playlist.')
                .then((msg) => {
                    search(playlistName)
                        .then((songData) => {
                            const playlists = songData.playlists;
                            if (index >= playlists.length)
                                reject(null);
                            else {
                                metaSearch_pl(playlists[index].listId)
                                    .then((pl) => {
                                        msg.edit(pl);
                                        const videos = pl.videos;

                                        if (data.flags.has('s')) {
                                            shuffle(videos)
                                                .then((list) => {
                                                    let arr = [];
                                                    for (let i in list)
                                                        arr.push(formatSongData(message, list[i], pl));
                                                    resolve(arr);
                                                })
                                                .catch((e) => reject(e));
                                        }
                                        else {
                                            let arr = [];
                                            for (let i in videos)
                                                arr.push(formatSongData(message, videos[i], pl));
                                            resolve(arr);
                                        }
                                    })
                                    .catch((err) => {
                                        console.error(err);

                                        msg.edit(playlists[index].listId);

                                        this.byPlaylist(message, playlistName, data, index + 1)
                                            .then((r) => resolve(r))
                                            .catch((err) => reject(err));
                                    });
                            }
                        })
                        .catch((err) => reject(err));
                });
        });
    }
};