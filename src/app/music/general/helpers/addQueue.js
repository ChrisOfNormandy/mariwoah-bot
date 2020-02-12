const queue = require('../../queue');
const getVC = require('../../../common/bot/helpers/getVC');
const shuffle = require('../../../common/bot/helpers/shuffle');
const play = require('../../general/helpers/play');

module.exports = async function (object, message, doShuffle) {
    const voiceChannel = getVC(message);
    if (!voiceChannel) return;

    let playlistArray = object.playlist;

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

        queue.serverMap.set(message.guild.id, activeQueue);
        console.log(`Created queue serverMap for ${message.guild.id}`)
    }

    if (doShuffle) {
        shuffle(object.playlist)
        .then(array => {
            if (!array) return;

            for (let i in array) {
                const song = {
                    title: array[i].title,
                    url: array[i].url
                };

                try {
                    queue.serverMap.get(message.guild.id).songs.push(song);
                }
                catch (e) {
                    console.log('Skipping song addition to queue.\n', e);
                }
            }
        })
        .catch(e => {
            console.log(e);
        });
    }
    else {
        console.log('Adding playlist to queue without shuffle.')
        for (let i in playlistArray) {
            try {
                queue.serverMap.get(message.guild.id).songs.push({
                    title: playlistArray[i].title,
                    url: playlistArray[i].url
                });
            }
            catch (e) {
                console.log('Skipping song addition to queue\n', e);
            }
        }
    }

    try {
        if (queue.serverMap.has(message.guild.id)) {
            let server = queue.serverMap.get(message.guild.id);

            var connection = await voiceChannel.join();
            queue.serverMap.get(message.guild.id).connection = connection;
            play(message.guild, server.songs[0]);
        }
    }
    catch (err) {
        console.log(err);
        return message.channel.send(err.message);
    }
}