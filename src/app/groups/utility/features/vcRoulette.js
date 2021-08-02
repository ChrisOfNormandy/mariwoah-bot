const Discord = require('discord.js');
const { Output } = require('@chrisofnormandy/mariwoah-bot');

const getVc = require('../../../helpers/getVoiceChannel');

/**
 * 
 * @param {Discord.Message} message 
 * @returns {Promise<Output>}
 */
module.exports = (message) => {
    let roll = Math.floor(Math.random() * 6) + 1;
    if (roll > 6)
        roll = 6;

    let vc = getVc(message);

    if (!vc)
        return Promise.reject(new Output().setError(new Error("Must be in a voice channel to play VC Roulette.")));

    return new Promise((resolve, reject) => {
        if (roll === 1) {
            message.member.voice.kick()
                .then(r => resolve(new Output(`${message.member.nickname === null ? message.author.username : message.member.nickname} has been disconnected.`).setValues(r)))
                .catch(err => reject(new Output(`${message.member.nickname === null ? message.author.username : message.member.nickname} should have disconnected, but I, the bot, do not have permission to kick them.`).setError(err)([err])));
        }
        else
            resolve(new Output(`${message.member.nickname === null ? message.author.username : message.member.nickname} rolled a ${roll}.`));
    });
};