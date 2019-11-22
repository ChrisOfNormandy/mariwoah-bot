const ytdl = require('ytdl-core');

const music = require('../music');
const getVC = require('../../main/bot/helpers/getVC');
const play = require('./play');

module.exports = async function (message) {
    const args = message.content.split(' ');

    const voiceChannel = getVC(message);
    if (!voiceChannel) return;

    const songInfo = await ytdl.getInfo(args[1]);
    const song = {
        title: songInfo.title,
        url: songInfo.video_url,
    };

    if (!music.serverQueue) {
        music.queueContruct = {
            textChannel: message.channel,
            voiceChannel: voiceChannel,
            connection: null,
            songs: [],
            volume: 5,
            playing: true,
        };
        if (!music.queue) music.queue = new Map();

        music.queue.set(message.guild.id, music.queueContruct);

        music.queueContruct.songs.push(song);

        try {
            let connection = await voiceChannel.join();
            music.queueContruct.connection = connection;
            play(message.guild, music.queueContruct.songs[0]);
        }
        catch (err) {
            console.log(err);
            music.queue.delete(message.guild.id);
            return message.channel.send(err);
        }
    }
    else {
        music.serverQueue.songs.push(song);
        console.log(serverQueue.songs);
        return message.channel.send(`${song.title} has been added to the queue!`);
    }
}