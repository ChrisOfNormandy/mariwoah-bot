const getSongObject = require('../../general/helpers/getSongObject');
const getVC = require('../../../common/bot/helpers/getVC');
const play = require('../../general/helpers/play');
const queue = require('../../queue');
const shuffle = require('../../../common/bot/helpers/shuffle');

module.exports = async function (object, message, doShuffle) {
    const voiceChannel = getVC(message);
    if (!voiceChannel)
        return;

    let playlistArray = object.playlist;

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

        queue.serverMap.set(message.guild.id, activeQueue);
    }

    if (doShuffle) {
        shuffle(object.playlist)
            .then(array => {
                if (!array)
                    return;

                try {
                    getSongObject.byUrl(message, array[0].url)
                        .then(song => {
                            queue.serverMap.get(message.guild.id).songs.push(song);
                        })
                        .then(async () => {
                            if (!queue.serverMap.get(message.guild.id).connection) {
                                var connection = await voiceChannel.join();
                                queue.serverMap.get(message.guild.id).connection = connection;
                            }
                            play(message, queue.serverMap.get(message.guild.id).songs[0]);

                            for (let i = 1; i < array.length; i++) {
                                getSongObject.byUrl(message, array[i].url)
                                    .then(song_ => {
                                        queue.serverMap.get(message.guild.id).songs.push(song_);
                                    })
                                    .catch(e => console.log(e));
                            }
                        })
                        .catch(e => console.log(e));
                }
                catch (e) {
                    console.log('Skipping song addition to queue.\n', e);
                }

                start(message, voiceChannel);
            })
            .catch(e => console.log(e));
    }
    else {
        try {
            getSongObject.byUrl(message, playlistArray[0].url)
                .then(song => {
                    queue.serverMap.get(message.guild.id).songs.push(song);
                })
                .then(async () => {
                    if (!queue.serverMap.get(message.guild.id).connection) {
                        var connection = await voiceChannel.join();
                        queue.serverMap.get(message.guild.id).connection = connection;
                    }
                    play(message, queue.serverMap.get(message.guild.id).songs[0]);

                    for (let i = 1; i < playlistArray.length; i++) {
                        getSongObject.byUrl(message, playlistArray[i].url)
                            .then(song_ => {
                                queue.serverMap.get(message.guild.id).songs.push(song_);
                            })
                            .catch(e => console.log(e));
                    }
                })
                .catch(e => console.log(e));
        }
        catch (e) {
            console.log('Skipping song addition to queue.\n', e);
        }
    }
}