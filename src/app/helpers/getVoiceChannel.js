const {Discord} = require('@chrisofnormandy/mariwoah-bot');

/**
 * 
 * @param {Discord.Message} message 
 * @returns 
 */
module.exports = (message) => {
    const vc = message.member.voice.channel;
    if (!vc)
        return undefined;
    return vc;
};