const queue = require('../../queue');
const stop = require('./stop');
const ytdl = require('ytdl-core');

function play(message, song) {
    const guild = message.guild;
    if (!queue.serverMap.has(guild.id))
        return;

    const dispatcher = queue.serverMap.get(guild.id).connection.playStream(ytdl(song.url, { filter: 'audioonly', quality: 'highestaudio', highWaterMark: 1 << 25 }), { highWaterMark: 1 })
        .on('end', () => {
            if (queue.serverMap.has(guild.id)) {
                queue.serverMap.get(guild.id).previousSong = song;
                queue.serverMap.get(guild.id).songs.shift();

                if (queue.serverMap.get(guild.id).songs[0]) {
                    while (queue.serverMap.get(guild.id).songs[0].removed)
                        queue.serverMap.get(guild.id).songs.shift();

                    play(message, queue.serverMap.get(guild.id).songs[0]);
                }
            }
            else
                stop(message, 'End of active queue.');
        })
        .on('error', error => console.error(error));
    dispatcher.setVolumeLogarithmic(queue.serverMap.get(guild.id).volume / 5);
}

module.exports = function (message, song) {
    play(message, song);
}