const queue = require('../../queue');

module.exports = function(message, index) {
    let activequeue = queue.serverMap.get(message.guild.id) || null;
    if (isNaN(index) || activequeue == null || index >= activequeue.songs.length || index <= 0)
        return;

    queue.serverMap.get(message.guild.id).removed = !activequeue.removed;
}