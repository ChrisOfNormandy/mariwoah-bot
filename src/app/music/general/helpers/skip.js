const queue = require('../../queue');

module.exports = function (message) {
    if (!message.member.voiceChannel)
        return message.channel.send('You have to be in a voice channel to stop the music!');
    if (!queue.serverMap.has(message.guild.id))
        return message.channel.send('There is no song that I could skip!');
    queue.serverMap.get(message.guild.id).connection.dispatcher.end();
}