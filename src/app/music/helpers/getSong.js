const intToTimeString = require('../../common/bot/helpers/global/intToTimeString');
const ytdl = require('ytdl-core');
const ytSearch = require('yt-search');
const shuffle = require('../../common/bot/helpers/global/shuffle');

function func(message, songURL) {
    return new Promise((resolve, reject) => {
        ytdl.getInfo(songURL)
            .then((songInfo) => {
                let obj = intToTimeString.seconds(songInfo.player_response.videoDetails.lengthSeconds);
                let timestring = obj.string;
                let arr = songInfo.player_response.videoDetails.thumbnail.thumbnails;

                resolve({
                    // videoDetails: songInfo.videoDetails,
                    title: songInfo.videoDetails.title,
                    url: songInfo.videoDetails.video_url,
                    author: songInfo.player_response.videoDetails.author,
                    requested: {
                        id: message.author.id,
                        username: message.author.username
                    },
                    durationString: timestring,
                    duration: {
                        hours: obj.hour,
                        minutes: obj.minutes,
                        seconds: obj.seconds,
                        totalSeconds: songInfo.player_response.videoDetails.lengthSeconds
                    },
                    thumbnail: arr[arr.length - 1],
                    removed: false
                });
            })
            .catch(e => reject(e));
    });
}

function search(name, timeOut = 0) {
    return new Promise((resolve, reject) => {
        ytSearch(name, (err, data) => {
            if (timeOut > 10)
                reject(null);
            else {
                if (data.videos.length)
                    resolve(data);
                else
                    resolve(search(name), timeOut++);
            }
        });
    });
}

function search_pl(listID, timeOut = 0) {
    return new Promise((resolve, reject) => {
        ytSearch({listId: listID}, (err, data) => {
            if (timeOut > 10)
                reject(null);
            else {
                if (data.items.length)
                    resolve(data);
                else
                    resolve(search_pl(listID), timeOut++);
            }
        });
    });
}

module.exports = {
    byURL: async function (message, songURL) {
        return new Promise((resolve, reject) => {
            func(message, songURL)
                .then(song => resolve(song))
                .catch(e => reject(e));
        });
    },
    byURLArray: function (message, urlArray) {
        return new Promise((resolve, reject) => {
            let arr = [];
            for (let i in urlArray) {
                arr.push(func(message, urlArray[i]))
            }
            Promise.all(arr)
                .then(songs => resolve(songs))
                .catch(e => reject(e));
        });
    },
    byName: function (message, songName, data) {
        return new Promise((resolve, reject) => {
            search(songName)
                .then(songData => {
                    const videos = songData.videos;

                    func(message, videos[0].url)
                        .then(song => resolve(song))
                        .catch(e => reject(e));

                })
                .catch(e => reject(e));
        });
    },
    byPlaylist: function (message, playlistName, data) {
        return new Promise((resolve, reject) => {
            message.channel.send('Please wait while I fetch all the songs in the playlist.')
            .then(msg => {
                search(playlistName)
                    .then(songData => {
                        const playlists = songData.playlists;

                        search_pl(playlists[0].url.split('playlist?list=')[1])
                            .then(pl => {
                                let arr = pl.items.map((item) => { return item.url });

                                this.byURLArray(message, arr)
                                    .then(songs => {
                                        console.log(songs);
                                        msg.delete();
                                        resolve(songs);
                                    })
                                    .catch(e => reject(e));
                            })
                            .catch(e => reject(e));
                    })
                    .catch(e => reject(e));
            });
        })
    }
}