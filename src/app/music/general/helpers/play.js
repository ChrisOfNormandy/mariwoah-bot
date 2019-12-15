const ytdl = require('ytdl-core');
const queue = require('../../queue');

function play (guild, song) {
    queue.serverQueue = queue.queue.get(guild.id);
    if (queue.serverQueue.songs[0]) console.log(`Now playing: ${queue.serverQueue.songs[0].title}`);
    else {
        queue.serverQueue.voiceChannel.leave();
        console.log('Ending queue.');
        queue.queue.delete(guild.id);
        queue.serverQueue = null;
        return;
    }
    
    const dispatcher = queue.serverQueue.connection.playStream(ytdl(song.url,{filter: 'audioonly', quality: 'highestaudio', highWaterMark: 1<<25 }), {highWaterMark: 1})
        .on('end', () => {
            console.log('Music ended!');
            previousSong = song;
            queue.serverQueue.songs.shift();           
            play(guild, queue.serverQueue.songs[0]);
        })
        .on('error', error => console.error(error));
    dispatcher.setVolumeLogarithmic(queue.serverQueue.volume / 5);
}

module.exports = function (guild, song) {
    play(guild, song);
}