const queue = require('../queue/map');
const chatFormat = require('../../../common/bot/helpers/global/chatFormat');

function pause(message) {
    let activeQueue = queue.get(message.guild.id);
    if (!activeQueue || !activeQueue.dispatcher)
        return { value: chatFormat.response.music.pause.no_stream() };

    dispatcher.pause();
    return { value: chatFormat.response.music.pause.yes() };
}

function resume(message) {
    let activeQueue = queue.get(message.guild.id);
    if (!activeQueue || !activeQueue.dispatcher)
        return { value: chatFormat.response.music.pause.no_stream() };

    dispatcher.resume();
    return { value: chatFormat.response.music.pause.no() }
}

module.exports = {
    pause,
    resume
}