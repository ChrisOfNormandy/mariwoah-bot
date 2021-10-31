const Discord = require('discord.js');

/**
 * 
 * @param {Discord.Message} message 
 * @returns 
 */
module.exports = (message) => {
    const vc = message.member.voice.channel;
    return !vc ? undefined : vc;
};