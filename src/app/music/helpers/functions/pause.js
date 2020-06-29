const queue = require('../queue/map');

function pause(message) {
    let dispatcher = queue.get(message.guild.id).dispatcher;
    if (dispatcher === null)
        return '> No active stream.';
    
    dispatcher.pause();
    return '> :pause_button: Paused.';
}

function resume(message) {
    let dispatcher = queue.get(message.guild.id).dispatcher;
    if (dispatcher === null)
        return '> No active stream';

    dispatcher.resume();
    return '> Resuming.'
}

module.exports = {
    pause,
    resume
}