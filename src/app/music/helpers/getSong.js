const intToTimeString = require('../../common/bot/helpers/global/intToTimeString');
const ytdl = require('ytdl-core');
const ytSearch = require('yt-search');

async function func(message, songURL) {
    return new Promise((resolve, reject) =>  {
        ytdl.getInfo(songURL)
            .then(async (songInfo) => {
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
    byName: async function (message, songName, list = false, videoIndex = 0, returnPlaylist = false) {
        return new Promise((resolve, reject) =>  {
            ytSearch(songName, function (err, r) {
                if (err)
                    reject(err);
                else {
                    const videos = r.videos;
                    const playlists = r.playlists || r.lists;
                    //const channels = r.channels || r.accounts;

                    if (returnPlaylist) {
                        if (list) {}
                    }
                    else {
                        if (list) {
                            const count = (videos.length >= 10)
                                ? 10
                                : videos.length;

                            let vid = 0;
                            let arr = [];
                            while (vid < count) {
                                arr.push(func(message, songURL));
                            }

                            Promise.all(arr)
                                .then(songs => resolve(songs))
                                .catch(e => reject(e));
                        }

                        if (!videos[videoIndex]) {
                            message.channel.send('Encountered an error searching for video. Please retry.');
                            reject(null);
                        }
                        else if (!videos[videoIndex].url) {
                            message.channel.send('Encountered an error getting video URL. Please retry.');
                            reject(null);
                        }
                        else
                            func(message, videos[videoIndex].url)
                                .then(song => resolve(song))
                                .catch(e => reject(e));
                    }
                }
            });
        });
    }
}