const intToTimeString = require('../../../common/bot/helpers/global/intToTimeString');
const getEmbedSongInfo = require('./getEmbedSongInfo');
const ytdl = require('ytdl-core');
const ytSearch = require('yt-search');

async function func(message, songURL) {
    return new Promise(function (resolve, reject) {
        ytdl.getInfo(songURL)
            .then(async (songInfo) => {
                let obj = intToTimeString.seconds(songInfo.player_response.videoDetails.lengthSeconds);
                let timestring = obj.string;
                let arr = songInfo.player_response.videoDetails.thumbnail.thumbnails;

                resolve({
                    title: songInfo.title,
                    url: songInfo.video_url,
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
    byUrl: async function (message, songURL) {
        return func(message, songURL);
    },
    byName: async function (message, songName, list = false, videoIndex = 0, returnPlaylist = false) {
        return new Promise(function (resolve, reject) {
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
                        if (list)
                            getEmbedSongInfo.possibleSongs(videos)
                                .then(embedMsg => message.channel.send(embedMsg))
                                .catch(e => reject(e));

                        if (!videos[videoIndex].url)
                            reject(null);
                        else
                            resolve(func(message, videos[videoIndex].url));
                    }
                }
            });
        });
    },
    repair: function (song) {
        return new Promise(function (resolve, reject) {
            func(song.url)
                .then(newSong => resolve(newSong))
                .catch(e => reject(e));
        })
    }
}