const queue = require('./map');
const getVC = require('../../../common/bot/helpers/global/getVoiceChannel');
const play = require('../functions/play');
const getEmbed = require('../getEmbedSongInfo');

module.exports = async function (message, song) {
    const voiceChannel = getVC(message);
    if (!voiceChannel)
        return;

    if (!queue.has(message.guild.id) || !queue.get(message.guild.id).active) {
        let activeQueue = {
            textChannel: message.channel,
            voiceChannel: voiceChannel,
            connection: null,
            songs: [],
            volume: 5,
            active: true,
            previousSong: null
        };

        queue.set(message.guild.id, activeQueue);
    }

    queue.get(message.guild.id).songs.push({song: song, request: message.author});

    if (!queue.get(message.guild.id).connection) {
        var connection = await voiceChannel.join();
        queue.get(message.guild.id).connection = connection;
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