const getVC = require('../../../common/bot/helpers/global/getVoiceChannel');
const queue = require('../queue/map');

module.exports = function (message, reason = '> Stopping all music.') {
    const vc = getVC(message);
    if (!vc)
        return '> You have to be in a voice channel to stop the music!';

    if (!queue.has(message.guild.id))
        return '> There is nothing to stop.';

    queue.delete(message.guild.id);
    getVC(message).leave();

    return reason;
}