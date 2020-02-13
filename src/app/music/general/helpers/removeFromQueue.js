const queue = require('../../queue');

module.exports = function(message, index) {
    let activequeue = queue.serverMap.get(message.guild.id);
    if (isNaN(index))
        return;

    if (index >= activequeue.songs.length || index <= 0)
        return;

    let obj = activequeue.songs[index];
    obj['removed'] = !obj.removed || true;

    activequeue.songs[index] = obj;

    queue.serverMap.set(message.guild.key, activequeue);
}