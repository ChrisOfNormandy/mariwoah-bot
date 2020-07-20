const getSongObject = require('../../helpers/getSong');
const getVC = require('../../../common/bot/helpers/global/getVoiceChannel');
const play = require('../../helpers/functions/play');
const queue = require('../../helpers/queue/map');
const shuffle = require('../../../common/bot/helpers/global/shuffle');
const db = require('../../../sql/adapter');

function func(message, voiceChannel, array) {
    getSongObject.byUrl(message, array[0].url)
        .then(song => queue.get(message.guild.id).songs.push(song))
        .then(async () => {
            if (!queue.get(message.guild.id).connection) {
                var connection = await voiceChannel.join();
                queue.get(message.guild.id).connection = connection;
                play(message, queue.get(message.guild.id).songs[0]);
            }
            
            for (let i = 1; i < array.length; i++) {
                getSongObject.byUrl(message, array[i].url)
                    .then(song_ => {
                        queue.get(message.guild.id).songs.push(song_);
                    })
                    .catch(e => console.log(e));
            }
        })
        .catch(e => console.log(e));
}

module.exports = function (message, name, doShuffle) {
    const voiceChannel = getVC(message);
    if (!voiceChannel)
        return message.channel.send('> You must be in a voice channel to use playlists.');

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

    db.playlists.get(message, name)
        .then(data => {
            let list = JSON.parse(data.list);
            if (list === null)
                return message.channel.send('> There are no songs in the selected playlist.');

            if (doShuffle) {
                shuffle(list)
                    .then(array => {
                        func(message, voiceChannel, array)
                    })
                    .catch(e => console.log(e));
            }
            else
                func(message, voiceChannel, list)
        })
        .catch(e => console.log(e));
}