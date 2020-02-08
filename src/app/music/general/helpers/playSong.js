const ytdl = require('ytdl-core');

const play = require('./play');
const getVC = require('../../../common/bot/helpers/getVC');
const queue = require('../../queue');

module.exports = async function (message) {
    const args = message.content.split(' ');

    const voiceChannel = getVC(message);
    if (!voiceChannel) return;

    ytdl.getInfo(args[1])
    .then(async (songInfo) => {
        const song = {
            title: songInfo.title,
            url: songInfo.video_url,
        };
    
        if (!queue.serverQueue) {
            queue.queueContruct = {
                textChannel: message.channel,
                voiceChannel: voiceChannel,
                connection: null,
                songs: [],
                volume: 5,
                playing: true,
            };
            if (!queue.queue) queue.queue = new Map();
    
            queue.queue.set(message.guild.id, queue.queueContruct);
    
            queue.queueContruct.songs.push(song);
    
            try {
                let connection = await voiceChannel.join();
                queue.queueContruct.connection = connection;
                play(message.guild, queue.queueContruct.songs[0]);
            }
            catch (err) {
                console.log(err);
                queue.queue.delete(message.guild.id);
                return message.channel.send(err);
            }
        }
        else {
            queue.serverQueue.songs.push(song);
            console.log(queue.serverQueue.songs);
            return message.channel.send(`${song.title} has been added to the queue!`);
        }
    })
    .catch(e => {
        console.log(e);
        message.channel.send(e.message);
    })
}