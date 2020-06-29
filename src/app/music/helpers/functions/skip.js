const queue = require('../queue/map');
const getVC = require('../../../common/bot/helpers/global/getVoiceChannel');

module.exports = function (message) {
    if (!getVC(message))
        return '> You have to be in a voice channel to stop the music!';
    if (!queue.has(message.guild.id) || !queue.get(message.guild.id).active)
        return `> There's nothing to skip.`;

    queue.get(message.guild.id).connection.dispatcher.end();
    return '> Skipping song...';
}