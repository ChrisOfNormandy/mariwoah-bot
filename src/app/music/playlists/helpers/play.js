const getEmbed = require('../../helpers/getEmbedSongInfo');
const getVC = require('../../../common/bot/helpers/global/getVoiceChannel');
const play = require('../../helpers/functions/play');
const queue = require('../../helpers/queue/map');
const shuffle = require('../../../common/bot/helpers/global/shuffle');
const db = require('../../../sql/adapter');

async function func(message, array) {
    const voiceChannel = getVC(message);

    if (!voiceChannel)
        return "No voice channel!";

    if (!queue.has(message.guild.id) || !queue.get(message.guild.id).active) {
        let activeQueue = {
            textChannel: message.channel,
            voiceChannel: voiceChannel,
            connection: null,
            songs: [],
            volume: 5,
            active: true,
            previousSong: null,
            dispatcher: null
        };

        queue.set(message.guild.id, activeQueue);
    }

    for (let i in array)
        queue.get(message.guild.id).songs.push({ song: array[i], request: message.author });

    if (queue.get(message.guild.id).connection === null) {
        var connection = await voiceChannel.join();
        queue.get(message.guild.id).connection = connection;
    }

    return new Promise((resolve, reject) => {
        if (queue.get(message.guild.id).songs.length == 1) {
            getEmbed.single('Now playing...', queue.get(message.guild.id), 0)
                .then(msg => resolve(msg))
                .catch(e => reject(e));
            play(message, queue.get(message.guild.id).songs[0]);
        }
        else {
            getEmbed.single('Added to queue:', queue.get(message.guild.id), queue.get(message.guild.id).songs.length - 1)
                .then(msg => resolve(msg))
                .catch(e => reject(e));
        }
    });
}

module.exports = function (message, name, doShuffle = null) {
    return new Promise((resolve, reject) => {
        db.playlists.get(message, name)
            .then(data => {
                let list = JSON.parse(data.list);

                if (list === null)
                    resolve('> There are no songs in the selected playlist.');
                else {
                    if (doShuffle) {
                        shuffle(list)
                            .then(array => resolve(func(message, array)))
                            .catch(e => reject(e));
                    }
                    else
                        resolve(func(message, list));
                }
            })
            .catch(e => reject(e));
    });
}