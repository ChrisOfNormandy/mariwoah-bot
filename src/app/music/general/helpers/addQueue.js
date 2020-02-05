const queue = require('../../queue');
const getVC = require('../../../common/bot/helpers/getVC');
const shuffle = require('../../../common/bot/helpers/shuffle');
const play = require('../../general/helpers/play');

module.exports = async function (object, message, doShuffle) {
    const voiceChannel = getVC(message);
    if (!voiceChannel) return;

    let playlistArray = object.playlist;

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
    }

    if (doShuffle) {
        playlistArray = await shuffle(object.playlist)
        .then(state => {
            console.log(state)
            if (!state) return;

            console.log('Shuffled playlist successfully.');

            for (let i = 0; i < playlistArray.length; i++) {
                const song = {
                    title: playlistArray[i].title,
                    url: playlistArray[i].url
                };
        
                try {
                    queue.queueContruct.songs.push(song);
                    console.log(`Added ${song.title} to queue.`);
                }
                catch (e) {
                    console.log(e);
                    return;
                }
            }
        })
        .catch(e => {
            console.log(e);
        })
    }
    else {
        console.log('Adding playlist to queue without shuffle.')
        for (let i = 0; i < playlistArray.length; i++) {

            const song = {
                title: playlistArray[i].title,
                url: playlistArray[i].url
            };

            try {
                queue.queueContruct.songs.push(song);
                console.log(`Added ${song.title} to queue.`);
            }
            catch (e) {
                console.log(e);
                return;
            }
        }
    }


    try {
        var connection = await voiceChannel.join();
        queue.queueContruct.connection = connection;
        play(message.guild, queue.queueContruct.songs[0]);
    }
    catch (err) {
        console.log(err);
        queue.queue.delete(message.guild.id);
        return message.channel.send(err);
    }
}