const music = require('../music');
const getVC = require('../../../common/bot/helpers/getVC');
const shuffle = require('./shuffle');
const play = require('./play');

module.exports = async function (object, message, doShuffle) {
    const voiceChannel = getVC(message);
    if (!voiceChannel) return;

    let playlistArray = object.playlist;

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
    }

    if (doShuffle) {
        playlistArray = await shuffle(object.playlist)
        .then(state => {
            if (!state) return;

            console.log('Shuffled playlist successfully.');

            for (let i = 0; i < playlistArray.length; i++) {

                const song = {
                    title: playlistArray[i].title,
                    url: playlistArray[i].url
                };
        
                try {
                    music.queueContruct.songs.push(song);
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
                music.queueContruct.songs.push(song);
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
        music.queueContruct.connection = connection;
        play(message.guild, music.queueContruct.songs[0]);
    }
    catch (err) {
        console.log(err);
        music.queue.delete(message.guild.id);
        return message.channel.send(err);
    }
}