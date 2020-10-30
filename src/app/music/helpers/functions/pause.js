const queue = require('../queue/map');
const chatFormat = require('../../../common/bot/helpers/global/chatFormat');
const commandFormat = require('../../../common/bot/helpers/global/commandFormat');

function pause(message) {
    let activeQueue = queue.get(message.guild.id);
    if (!activeQueue || !activeQueue.dispatcher)
        return commandFormat.error([], [chatFormat.response.music.pause.no_stream()]);

    activeQueue.dispatcher.pause();
    return commandFormat.valid([], [chatFormat.response.music.pause.yes()]);
}

function resume(message) {
    let activeQueue = queue.get(message.guild.id);
    if (!activeQueue || !activeQueue.dispatcher)
        return commandFormat.error([], [chatFormat.response.music.pause.no_stream()]);

    activeQueue.dispatcher.resume();
    return commandFormat.valid([], [chatFormat.response.music.pause.no()]);
}

module.exports = {
    pause,
    resume
}