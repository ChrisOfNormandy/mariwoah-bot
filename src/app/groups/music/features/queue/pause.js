const queue = require('./map');
const {chatFormat, output} = require('../../../../helpers/commands');

function pause(message) {
    return Promise.reject(output.error([], ['This command works, but resuming does not with the current Node version.']));
    let activeQueue = queue.get(message.guild.id);
    if (!activeQueue || !activeQueue.dispatcher)
        return Promise.reject(output.error([], [chatFormat.response.music.pause.no_stream()]));

    activeQueue.dispatcher.pause(true);
    return Promise.resolve(output.valid([], [chatFormat.response.music.pause.yes()]));
}

function resume(message) {
    let activeQueue = queue.get(message.guild.id);
    if (!activeQueue || !activeQueue.dispatcher)
        return Promise.reject(output.error([], [chatFormat.response.music.pause.no_stream()]));

    activeQueue.dispatcher.resume();
    return Promise.resolve(output.valid([], [chatFormat.response.music.pause.no()]));
}

module.exports = {
    pause,
    resume
}