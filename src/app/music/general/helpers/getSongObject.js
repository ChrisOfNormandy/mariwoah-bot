const intToTimeString = require('../../../common/bot/helpers/intToTimeString');
const ytdl = require('ytdl-core');
const ytSearch = require('yt-search');

module.exports = {
    byUrl: async function (message, songURL) {
        return new Promise(function (resolve, reject) {
            ytdl.getInfo(songURL)
                .then(async (songInfo) => {
                    let obj = intToTimeString.seconds(songInfo.player_response.videoDetails.lengthSeconds);
                    let timestring = (obj.hour > 0) ? obj.hour + ':' : '' + obj.minutes + ':' + obj.seconds;
                    let arr = songInfo.player_response.videoDetails.thumbnail.thumbnails;

                    resolve({
                        title: songInfo.title,
                        url: songInfo.video_url,
                        videoAuthor: songInfo.player_response.videoDetails.author,
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
    },
    byName: async function (message, songName) {
        ytSearch(songName, function (err, r) {
            const videos = r.videos;
            //const playlists = r.playlists || r.lists;
            //const channels = r.channels || r.accounts;

            return this.byUrl(message, videos[0].url);
        });
    }
}