const getEmbedSongInfo = require('./getEmbedSongInfo');
const queue = require('../../queue');

module.exports = function (message) {
    if (!queue.serverMap.has(message.guild.id) || queue.serverMap.get(message.guild.id).songs.length == 0 || !queue.serverMap.get(message.guild.id).playing) {
        message.channel.send(`> There's nothing in the active queue.`);
        return;
    }

    getEmbedSongInfo.queueList(queue.serverMap.get(message.guild.id))
        .then(embedMsg => message.channel.send(embedMsg))
        .catch(e => console.log(e));
}