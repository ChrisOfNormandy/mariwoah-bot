const queue = require('../../queue');

module.exports = function (message, reason = '> Stopping all music.') {
    if (!message.member.voiceChannel)
        return message.channel.send('> You have to be in a voice channel to stop the music!');

    if (!queue.serverMap.has(message.guild.id))
        return;

    let activeQueue = {
        textChannel: null,
        voiceChannel: null,
        connection: null,
        songs: [],
        volume: 5,
        playing: false,
        previousSong: null
    };

    queue.serverMap.get(message.guild.id).connection.dispatcher.end()
    .then(() => {
        queue.serverMap.get(message.guild.id).voiceChannel.leave();
        queue.serverMap.set(message.guild.id, activeQueue);
        console.log(reason);
        message.channel.send(reason);
    })
    .catch(e => console.log(e));
}