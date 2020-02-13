const getEmbededSongInfo = require('./getEmbedSongInfo');
const getSongObject = require('./getSongObject');
const getVC = require('../../../common/bot/helpers/getVC');
const play = require('./play');
const queue = require('../../queue');
const stop = require('./stop');
const ytdl = require('ytdl-core');

module.exports = async function (message, songURL, songName = null, vc = null) {
    const voiceChannel = (vc !== null) ? vc : getVC(message);
    if (!voiceChannel)
        return;

    getSongObject.byUrl(message, songURL)
        .then(async (song) => {
            if (!queue.serverMap)
                queue.serverMap = new Map();                

            if (!queue.serverMap.has(message.guild.id) || !queue.serverMap.get(message.guild.id).playing) {
                let activeQueue = {
                    textChannel: message.channel,
                    voiceChannel: voiceChannel,
                    connection: null,
                    songs: [],
                    volume: 5,
                    playing: true,
                    previousSong: null
                };

                activeQueue.songs.push(song);

                try {
                    let connection = await voiceChannel.join();
                    activeQueue.connection = connection;
                    queue.serverMap.set(message.guild.id, activeQueue);

                    play(message.guild, activeQueue.songs[0]);

                    getEmbededSongInfo.single('Now playing...', activeQueue, 0)
                    .then(embedMsg => {
                        message.channel.send(embedMsg);
                    })
                    .catch(e => console.log(e));
                }
                catch (err) {
                    console.log(err);
                    if (activeQueue.songs.length == 1)
                        stop(message, err.message);
                }
            }
            else {
                let activeQueue = queue.serverMap.get(message.guild.id);
                queue.serverMap.get(message.guild.id).songs.push(song);

                getEmbededSongInfo.single(message.guild, 'Added to queue', activeQueue, activeQueue.songs.length - 1)
                .then(embedMsg => {
                    message.channel.send(embedMsg);
                })
                .catch(e => console.log(e));
            }
        })
        .catch(e => {
            console.log(e);
            message.channel.send(e.message);
        })
}