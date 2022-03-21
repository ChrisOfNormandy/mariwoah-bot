// eslint-disable-next-line no-unused-vars
const Discord = require('discord.js');
const { Output, handlers } = require('@chrisofnormandy/mariwoah-bot');

const { shuffle } = handlers.arrays;
const { voiceChannel } = handlers.channels;

const queue = require('./queue');
const play = require('./play');
// eslint-disable-next-line no-unused-vars
const Queue = require('../../helpers/Queue');

/**
 * 
 * @param {Discord.Message} message 
 * @param {SongData[]} songs 
 * @param {Map<string, *>} flags 
 * @param {Queue} q
 * @returns {Promise<Output>}
 */
function start(message, songs, flags, q) {
    if (!songs.length)
        return Promise.reject(new Output().setError(new Error('No songs to add.')));

    return new Promise((resolve, reject) => {
        q.add(message.member, ...songs);

        play(message, q)
            .then((r) => resolve(r))
            .catch((err) => reject(err));
    });
}

/**
 * 
 * @param {Discord.Message} message 
 * @param {Map} flags 
 * @param {SongData[]} songs 
 * @param {Queue} q
 * @returns {Promise<Output>}
 */
function process(message, songs, flags, q) {
    return new Promise((resolve, reject) => {
        if (flags.has('s'))
            shuffle(songs)
                .then((songs) => {
                    start(message, songs, flags, q)
                        .then((res) => resolve(res))
                        .catch((err) => reject(err));
                })
                .catch((err) => reject(new Output().setError(err)));
        else
            start(message, songs, flags, q)
                .then((res) => resolve(res))
                .catch((err) => reject(err));
    });
}

/**
 * 
 * @param {Discord.Message} message 
 * @param {SongData[]} songs 
 * @param {Map<string, *>} flags 
 * @returns {Promise<Output>}
 */
module.exports = (message, songs, flags) => {
    return new Promise((resolve, reject) => {
        if (!songs.length)
            reject(new Output().setError(new Error('Tried to add 0 songs to the active queue.')));
        else {
            const vc = voiceChannel.get(message);

            if (!vc)
                reject(new Output().setError(new Error('No voice channel.')));
            else {
                if (!queue.exists(message.guild.id)) {
                    queue.add(message.guild.id, vc.id);
                }

                const q = queue.get(message.guild.id);

                const connection = voiceChannel.join(message, vc.id);
                queue.get(message.guild.id).connect(connection);

                process(message, songs, flags, q)
                    .then((r) => resolve(new Output().setValues(r)))
                    .catch((err) => reject(new Output().setError(err)));
            }
        }
    });
};