const music = require('../music');
const global = require('../../../common/core');

module.exports = function (message) {
    let serverQueue = music.serverQueue;

    if (!serverQueue) {
        message.channel.send(`The queue contains... _n o t h i n g . . ._`);
        return;
    }

    let msg = '';
    
    if (music.previousSong != null) msg += `**Previous** - ${music.previousSong.title}.\n${global.chatBreak}\n`;

    let upTo = serverQueue.songs.length <= 10 ? serverQueue.songs.length : 10;

    msg += `**Now Playing...** ${serverQueue.songs[0].title}\n${global.chatBreak}\n**Up next**:\n`;
    
    if (serverQueue.songs.length > 1) {
        for (let i = 1; i <= upTo; i++) {
            msg += `${i}. ${serverQueue.songs[i].title}\n`;
        }
        if (serverQueue.songs.length > 10) {
            msg += `... and ${serverQueue.songs.length - 10} more!`;
        }
        message.channel.send(msg);
    }
    else if (serverQueue.songs.length == 1) {
        message.channel.send(`**Now Playing...** ${serverQueue.songs[0].title}`);
    }
    else {
        message.channel.send(`The queue contains... _n o t h i n g . . ._`);
    }
}