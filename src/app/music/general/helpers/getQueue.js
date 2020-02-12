const queue = require('../../queue');
const chatFormats = require('../../../common/bot/helpers/chatFormats');

module.exports = function (message) {
    if (!queue.serverMap.has(message.guild.id) || queue.serverMap.get(message.guild.id).songs.length == 0) {
        message.channel.send(`The queue contains... _n o t h i n g . . ._`);
        return;
    }

    let activeQueue = queue.serverMap.get(message.guild.id);

    let msg = '';

    if (activeQueue.previousSong != null)
        msg += `**Previous** - ${activeQueue.previousSong.title}.\n${chatFormats.chatBreak}\n`;

    let upTo = (activeQueue.songs.length <= 10) ? activeQueue.songs.length : 10;

    msg += `**Now Playing...** ${activeQueue.songs[0].title}\n${chatFormats.chatBreak}\n**Up next**:\n`;

    if (activeQueue.songs.length > 1) {
        if (upTo == activeQueue.songs.length)
            upTo = (activeQueue.songs.length <= 10) ? activeQueue.songs.length - 1 : 10;

        for (let i = 1; i <= upTo; i++) {
            msg += `${i}. ${activeQueue.songs[i].title}\n`;
        }
        if (activeQueue.songs.length > 11) {
            msg += `... and ${activeQueue.songs.length - 11} more!`;
        }
        message.channel.send(msg);
    }
    else if (activeQueue.songs.length == 1) {
        message.channel.send(`**Now Playing...** ${activeQueue.songs[0].title}`);
    }
}