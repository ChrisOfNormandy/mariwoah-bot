const music = require('../music');
const ytdl = require('ytdl-core');

function play (guild, song) {
    music.serverQueue = music.queue.get(guild.id);

    if (!song) {
        music.serverQueue.voiceChannel.leave();
        music.queue.delete(guild.id);
        return;
    }
    
    const dispatcher = music.serverQueue.connection.playStream(ytdl(song.url,{filter: 'audioonly', quality: 'highestaudio', highWaterMark: 1<<25 }), {highWaterMark: 1})
        .on('end', () => {
            console.log('Music ended!');
            previousSong = song;
            music.serverQueue.songs.shift();
            play(guild, music.serverQueue.songs[0]);
        })
        .on('error', error => {
            console.error(error);
        });
    dispatcher.setVolumeLogarithmic(music.serverQueue.volume / 5);
}

module.exports = function (guild, song) {
    play(guild, song);
}