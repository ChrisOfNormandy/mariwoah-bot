const getVC = require('../../../common/bot/helpers/getVC');
const play = require('./play');
const queue = require('../../queue');
const ytdl = require('ytdl-core');

module.exports = async function (message, songURL, vc = null) {

    const voiceChannel = (vc !== null) ? vc : getVC(message);
    if (!voiceChannel)
        return;

    ytdl.getInfo(songURL)
        .then(async (songInfo) => {
            const song = {
                title: songInfo.title,
                url: songInfo.video_url,
            };

            if (!queue.serverMap)
                queue.serverMap = new Map();

            if (!queue.serverMap.has(message.guild.id)) {
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
                }
                catch (err) {
                    console.log(err);
                    queue.serverMap.delete(message.guild.id);
                    return message.channel.send(err);
                }
            }
            else {
                queue.serverMap.get(message.guild.id).songs.push(song);
                return message.channel.send(`${song.title} has been added to the queue.`);
            }
        })
        .catch(e => {
            console.log(e);
            message.channel.send(e.message);
        })
}