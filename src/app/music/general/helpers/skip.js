const queue = require('../../queue');

module.exports = function (message) {
    if (!message.member.voiceChannel)
        return message.channel.send('> You have to be in a voice channel to stop the music!');
    if (!queue.serverMap.has(message.guild.id) || !queue.serverMap.get(message.guild.id).playing)
        return message.channel.send(`> There's nothing to skip.`);

    queue.serverMap.get(message.guild.id).connection.dispatcher.end()
    .then(() => {
        console.log('Skipped.');
    })
    .catch(e => console.log(e));
}