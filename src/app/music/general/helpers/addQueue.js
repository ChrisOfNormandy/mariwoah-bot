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

                for (let i in array) {
                    try {
                        queue.serverMap.get(message.guild.id).songs.push({
                            title: array[i].title,
                            url: array[i].video_url,
                            requested: message.author.id
                        });
                    }
                    catch (e) {
                        console.log('Skipping song addition to queue.\n', e);
                    }
                }
            })
            .catch(e => console.log(e));
    }
    else {
        for (let i in playlistArray) {
            try {
                queue.serverMap.get(message.guild.id).songs.push({
                    title: playlistArray[i].title,
                    url: playlistArray[i].url,
                    requested: message.author.id
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
            if (!server.connection) {
                var connection = await voiceChannel.join();
                queue.serverMap.get(message.guild.id).connection = connection;
                play(message.guild, server.songs[0]);
            }
        }
    }
    catch (err) {
        console.log(err);
        return message.channel.send(err.message);
    }
}