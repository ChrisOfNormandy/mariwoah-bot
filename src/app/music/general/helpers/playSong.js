const getEmbededSongInfo = require('./getEmbedSongInfo');
const getSongObject = require('./getSongObject');
const getVC = require('../../../common/bot/helpers/global/getVoiceChannel');
const play = require('./play');
const queue = require('../../queue');
const stop = require('./stop');

async function func(message, song, voiceChannel) {
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

        activeQueue.songs.push(song);

        try {
            let connection = await voiceChannel.join();
            activeQueue.connection = connection;

            queue.serverMap.set(message.guild.id, activeQueue);

            play(message, activeQueue.songs[0]);

            getEmbededSongInfo.single('Now playing...', activeQueue, 0)
                .then(embedMsg => {
                    message.channel.send(embedMsg);
                })
                .catch(e => console.log(e));
        }
        catch (err) {
            console.log(err);
            if (activeQueue.songs.length == 1)
                stop(message, err.message);
        }
    }
    else {
        let activeQueue = queue.serverMap.get(message.guild.id);
        queue.serverMap.get(message.guild.id).songs.push(song);

        getEmbededSongInfo.single('Added to queue', activeQueue, activeQueue.songs.length - 1)
            .then(embedMsg => {
                message.channel.send(embedMsg);
            })
            .catch(e => console.log(e));
    }
}

function playByURL(message, songURL, voiceChannel) {
    getSongObject.byUrl(message, songURL)
        .then(async (song) => {
            func(message, song, voiceChannel);
        })
        .catch(e => {
            console.log(e);
            message.channel.send(e.message);
        });
}

function playByName(message, songName, voiceChannel, list, videoIndex) {
    getSongObject.byName(message, songName, list, videoIndex)
        .then(async (song) => {
            func(message, song, voiceChannel);
        })
        .catch(e => {
            console.log(e);
            message.channel.send(e.message);
        });
}

module.exports = async function (message, songURL = null, songName = null, vc = null, showList = false, videoIndex = 0) {
    const voiceChannel = (vc !== null) ? vc : getVC(message);
    if (!voiceChannel)
        return;

    if (songURL === null && songName === null) {
        console.log('Bad playSong data.')
        return;
    }

    if (songURL != null)
        playByURL(message, songURL, voiceChannel);
    else if (songName != null)
        playByName(message, songName, voiceChannel, showList, videoIndex);
}