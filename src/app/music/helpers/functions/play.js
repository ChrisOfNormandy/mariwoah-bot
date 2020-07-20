const queue = require('../queue/map');
const stop = require('./stop');
const ytdl = require('ytdl-core');

function play(message, obj) {
    const song = obj.song;
    const id = message.guild.id;
    if (!queue.has(id))
        return;

    const dispatcher = queue.get(id).connection.playStream(ytdl(song.url, { filter: 'audioonly', quality: 'highestaudio', highWaterMark: 1 << 25 }), { highWaterMark: 1 })
        .on('end', () => {
            if (!queue.has(id)) {
                stop(message, '> End of queue.');
                return;
            }
            queue.get(id).previousSong = song;
            queue.get(id).songs.shift();

            if (queue.get(id).songs[0]) {
                while (queue.get(id).songs[0].removed)
                    queue.get(id).songs.shift();

                play(message, queue.get(id).songs[0]);
            }
            else
                stop(message, '> End of queue.');
        })
        .on('error', error => console.error(error));
    dispatcher.setVolumeLogarithmic(queue.get(id).volume / 5);
}

module.exports = (message, song) => play(message, song);