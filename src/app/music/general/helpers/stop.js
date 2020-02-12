const queue = require('../../queue');

module.exports = function(message) {
    if (!message.member.voiceChannel) return message.channel.send('You have to be in a voice channel to stop the music!');
    queue.serverMap.get(message.guild.id).connection.dispatcher.end();
    queue.serverMap.delete(message.guild.id);
    message.channel.send("Stopping all music.");
}