const queue = require('../queue/map');
const getVC = require('../../../common/bot/helpers/global/getVoiceChannel');

module.exports = function (message) {
    if (!getVC(message))
        return message.channel.send('> You have to be in a voice channel to stop the music!');
    if (!queue.has(message.guild.id) || !queue.get(message.guild.id).active)
        return message.channel.send(`> There's nothing to skip.`);

    message.channel.send('> Skipping song...');
    queue.get(message.guild.id).connection.dispatcher.end();
}