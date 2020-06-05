const getVC = require('../../../common/bot/helpers/global/getVoiceChannel');
const queue = require('../queue/map');

module.exports = function (message, reason = '> Stopping all music.') {
    const vc = getVC(message);
    if (!vc)
        return message.channel.send('> You have to be in a voice channel to stop the music!');

    if (!queue.has(message.guild.id))
        return message.channel.send('> There is nothing to stop.');

    message.channel.send(reason);
    queue.delete(message.guild.id);
    getVC(message).leave();
}