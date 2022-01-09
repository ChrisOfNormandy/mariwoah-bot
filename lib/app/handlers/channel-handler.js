"use strict";
/**
 *
 * @param {Discord.Message} message
 * @returns
 */
function getVoiceChannel(message) {
    const vc = message.member.voice.channel;
    return !vc
        ? undefined
        : vc;
}
module.exports = {
    getVoiceChannel
};
