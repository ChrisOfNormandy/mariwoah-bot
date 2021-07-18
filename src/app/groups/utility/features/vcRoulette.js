const getVc = require('../../../helpers/getVoiceChannel');
const { output } = require('../../../helpers/commands');
const Discord = require('discord.js');

/**
 * 
 * @param {Discord.Message} message 
 * @returns 
 */
module.exports = (message) => {
    let roll = Math.floor(Math.random() * 6) + 1;
    if (roll > 6)
        roll = 6;

    let vc = getVc(message);
    if (!vc)
        return Promise.reject(output.error([], ["Must be in a voice channel to play VC Roulette."]));

    return new Promise((resolve, reject) => {
        if (roll === 1) {
            message.member.voice.kick()
                .then(r => resolve(output.valid([], [`${message.member.nickname === null ? message.author.username : message.member.nickname} has been disconnected.`])))
                .catch(err => reject(output.error([err], [`${message.member.nickname === null ? message.author.username : message.member.nickname} should have disconnected, but I, the bot, do not have permission to kick them.`])));
        }
        else
            resolve(output.valid([], [`${message.member.nickname === null ? message.author.username : message.member.nickname} rolled a ${roll}.`]));
    });
};