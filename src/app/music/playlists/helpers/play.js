const getEmbed = require('../../helpers/getEmbedSongInfo');
const getVC = require('../../../common/bot/helpers/global/getVoiceChannel');
const play = require('../../helpers/functions/play');
const queue = require('../../helpers/queue/map');
const shuffle = require('../../../common/bot/helpers/global/shuffle');
const db = require('../../../sql/adapter');

async function func(message, array) {
    const voiceChannel = getVC(message);

    if (!voiceChannel)
        return console.log("No voice channel!");

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
        queue.get(message.guild.id).songs.push({song: array[i], request: message.author});

    if (queue.get(message.guild.id).connection === null) {
        var connection = await voiceChannel.join();
        queue.get(message.guild.id).connection = connection;
    }

    if (queue.get(message.guild.id).songs.length == 1) {
        getEmbed.single('Now playing...', queue.get(message.guild.id), 0)
            .then(msg => message.channel.send(msg))
            .catch(e => console.log(e));
        play(message, queue.get(message.guild.id).songs[0]);
    }
    else {
        getEmbed.single('Added to queue:', queue.get(message.guild.id), queue.get(message.guild.id).songs.length - 1)
            .then(msg => message.channel.send(msg))
            .catch(e => console.log(e));
    }
}

module.exports = function (message, name, doShuffle) {
    db.playlists.get(message, name)
        .then(data => {
            let list = JSON.parse(data.list);
            if (list === null)
                return message.channel.send('> There are no songs in the selected playlist.');

            if (doShuffle) {
                shuffle(list)
                    .then(array => {
                        func(message, array)
                    })
                    .catch(e => console.log(e));
            }
            else
                func(message, list)
        })
        .catch(e => console.log(e));
}