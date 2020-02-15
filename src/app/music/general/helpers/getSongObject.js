const intToTimeString = require('../../../common/bot/helpers/intToTimeString');
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
    byName: async function (message, songName, list = false) {
        return new Promise(function (resolve, reject) {
            ytSearch(songName, async function (err, r) {
                if (err)
                    reject(err);

                const videos = r.videos;
                //const playlists = r.playlists || r.lists;
                //const channels = r.channels || r.accounts;

                if (list) {
                    getEmbedSongInfo.possibleSongs(videos)
                        .then(embedMsg => {
                            message.channel.send(embedMsg);
                        })
                        .catch(e => {
                            reject(e);
                        });
                }

                if (!videos[0].url)
                    reject(null);

                resolve(func(message, videos[0].url));
            });
        })

    }
}