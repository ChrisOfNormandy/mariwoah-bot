const queue = require('../../queue');

module.exports = function(message) {
    if (!message.member.voiceChannel) return message.channel.send('You have to be in a voice channel to stop the music!');
    queue.serverQueue.songs = [];
    queue.serverQueue.connection.dispatcher.end();
    message.channel.send("Stopping all music.");
}