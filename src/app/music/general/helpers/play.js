const queue = require('../../queue');
const stop = require('./stop');
const ytdl = require('ytdl-core');

function play(guild, song) {
    if (!queue.serverMap.has(guild.id))
        return;

    let activeQueue = queue.serverMap.get(guild.id);

    if (!activeQueue.songs[0]) {
        stop(message);
        return;
    }

    const dispatcher = activeQueue.connection.playStream(ytdl(song.url, { filter: 'audioonly', quality: 'highestaudio', highWaterMark: 1 << 25 }), { highWaterMark: 1 })
        .on('end', () => {
            queue.serverMap.get(guild.id).previousSong = song;
            queue.serverMap.get(guild.id).songs.shift();

            if (queue.serverMap.get(guild.id).songs[0]) {
                while (queue.serverMap.get(guild.id).songs[0].removed)
                    queue.serverMap.get(guild.id).songs.shift();

                play(guild, queue.serverMap.get(guild.id).songs[0]);
            }
            else
                stop(message, 'End of active queue.');
        })
        .on('error', error => console.error(error));
    dispatcher.setVolumeLogarithmic(activeQueue.volume / 5);
}

module.exports = function (guild, song) {
    play(guild, song);
}