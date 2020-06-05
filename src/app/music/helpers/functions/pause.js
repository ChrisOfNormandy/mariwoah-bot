const queue = require('../queue/map');

function pause(message) {
    let dispatcher = queue.get(message.guild.id).dispatcher;
    if (dispatcher === null)
        return message.channel.send('> No active stream.');
    
    message.channel.send('> :pause_button: Paused.')
    dispatcher.pause();
}

function resume(message) {
    let dispatcher = queue.get(message.guild.id).dispatcher;
    if (dispatcher === null)
        return message.channel.send('> No active stream');

    message.channel.send('> Resuming!')
    dispatcher.resume();
}

module.exports = {
    pause,
    resume
}