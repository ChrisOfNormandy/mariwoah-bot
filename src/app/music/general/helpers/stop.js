const leave = require('./leave');
const queue = require('../../queue');

module.exports = function (message, reason = '> Stopping all music.') {
    if (!message.member.voiceChannel)
        return message.channel.send('> You have to be in a voice channel to stop the music!');

    if (!queue.serverMap.has(message.guild.id))
        return;

    console.log(reason);
    message.channel.send(reason);
    queue.serverMap.delete(message.guild.id);
    leave(message);
}