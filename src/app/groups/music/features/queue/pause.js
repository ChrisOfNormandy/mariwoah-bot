const { Discord, Output, chatFormat } = require('@chrisofnormandy/mariwoah-bot');

const queue = require('./map');

/**
 * 
 * @param {Discord.Message} message 
 * @returns {Promise<Output>}
 */
function pause(message) {
    return Promise.reject(new Output().setError(new Error('This command works, but resuming does not with the current Node version.')));
    // let activeQueue = queue.get(message.guild.id);
    // if (!activeQueue || !activeQueue.dispatcher)
    //     return Promise.reject(Output.error([], [chatFormat.response.music.pause.no_stream()]));

    // activeQueue.dispatcher.pause(true);
    // return Promise.resolve(Output.valid([], [chatFormat.response.music.pause.yes()]));
}

/**
 * 
 * @param {Discord.Message} message 
 * @returns {Promise<Output>}
 */
function resume(message) {
    let activeQueue = queue.get(message.guild.id);

    if (!activeQueue || !activeQueue.dispatcher)
        return Promise.reject(new Output().setError(new Error(chatFormat.response.music.pause.no_stream())));

    activeQueue.dispatcher.resume();
    
    return Promise.resolve(new Output(chatFormat.response.music.pause.no()));
}

module.exports = {
    pause,
    resume
};