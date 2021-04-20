const queue = require('./map');
const stop = require('./stop');
const ytdl = require('ytdl-core');
const {chatFormat, output} = require('../../../../helpers/commands');

function next(message, id, song) {
    if (!queue.has(id))
        return output.error([stop(message, chatFormat.response.music.queue.end())], []);

    queue.get(id).previousSong = song;
    queue.get(id).songs.shift();

    if (queue.get(id).songs[0]) {
        while (queue.get(id).songs[0].removed)
            queue.get(id).songs.shift();

        play(message, queue.get(id).songs[0]);
    }
    else
        stop(message, chatFormat.response.music.queue.end());
}

function play(message, song) {
    const id = message.guild.id;
    if (!queue.has(id))
        return output.error([], [chatFormat.response.music.queue.no_active()]);

    queue.get(message.guild.id).dispatcher = queue.get(id).connection.play(ytdl(song.url, { filter: 'audioonly', quality: 'highestaudio', highWaterMark: 1 << 25 }), { highWaterMark: 1 })
        .on('finish', () => next(message, id, song))
        .on('error', error => {
            next(message, id, song);
            return output.error([error], [chatFormat.response.music.play.error(song.title)]);
        });
    queue.get(message.guild.id).dispatcher.setVolumeLogarithmic(queue.get(id).volume / 5);
}

module.exports = play;