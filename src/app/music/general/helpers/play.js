const ytdl = require('ytdl-core');
const queue = require('../../queue');

function play (guild, song) {
    if (!queue.serverMap.has(guild.id)) return;

    let activeQueue = queue.serverMap.get(guild.id);

    if (activeQueue.songs[0]) console.log(`Now playing: ${activeQueue.songs[0].title}`);
    else {
        activeQueue.voiceChannel.leave();
        console.log('Ending queue.');
        queue.serverMap.delete(guild.id);
        return;
    }

    const dispatcher = activeQueue.connection.playStream(ytdl(song.url,{filter: 'audioonly', quality: 'highestaudio', highWaterMark: 1<<25 }), {highWaterMark: 1})
        .on('end', () => {
            console.log('Music ended!');
            queue.serverMap.get(guild.id).previousSong = song;
            console.log(queue.serverMap.get(guild.id).previousSong);
            queue.serverMap.get(guild.id).songs.shift();
            setTimeout(() => {
                if (queue.serverMap.has(guild.id) && queue.serverMap.get(guild.id).songs[0]) play(guild, queue.serverMap.get(guild.id).songs[0]) }, 1000);
        })
        .on('error', error => {
            console.error(error);
        });
    dispatcher.setVolumeLogarithmic(activeQueue.volume / 5);
}

module.exports = function (guild, song) {
    play(guild, song);
}