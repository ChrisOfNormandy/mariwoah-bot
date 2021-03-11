const queue = require('../queue/map');
const chatFormat = require('../../../common/bot/helpers/global/chatFormat');
const commandFormat = require('../../../common/bot/helpers/global/commandFormat');

function pause(message) {
    return Promise.reject(commandFormat.error([], ['This command works, but resuming does not with the current Node version.']));
    let activeQueue = queue.get(message.guild.id);
    if (!activeQueue || !activeQueue.dispatcher)
        return Promise.reject(commandFormat.error([], [chatFormat.response.music.pause.no_stream()]));

    activeQueue.dispatcher.pause(true);
    return Promise.resolve(commandFormat.valid([], [chatFormat.response.music.pause.yes()]));
}

function resume(message) {
    let activeQueue = queue.get(message.guild.id);
    if (!activeQueue || !activeQueue.dispatcher)
        return Promise.reject(commandFormat.error([], [chatFormat.response.music.pause.no_stream()]));

    activeQueue.dispatcher.resume();
    return Promise.resolve(commandFormat.valid([], [chatFormat.response.music.pause.no()]));
}

module.exports = {
    pause,
    resume
}