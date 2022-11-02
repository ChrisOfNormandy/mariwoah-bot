// eslint-disable-next-line no-unused-vars
const Discord = require('discord.js');
const { Output, handlers } = require('@chrisofnormandy/mariwoah-bot');

const { shuffle } = handlers.arrays;
const { voiceChannel } = handlers.channels;

const queue = require('./queue');
const play = require('./play');

/**
 *
 * @param {Discord.Message} message
 * @param {SongData[]} songs
 * @param {Map<string, *>} flags
 * @param {import('../../helpers/Queue')} q
 * @returns
 */
function start(message, songs, flags, q) {
    if (!songs.length)
        return new Output().makeError('No songs to add.').reject();

    return play(message, q.add(message.member, ...songs));
}

/**
 *
 * @param {Discord.Message} message
 * @param {Map} flags
 * @param {SongData[]} songs
 * @param {import('../../helpers/Queue')} q
 * @returns
 */
function process(message, songs, flags, q) {
    if (flags.has('s'))
        return start(message, shuffle(songs), flags, q);

    return start(message, songs, flags, q);
}

/**
 *
 * @param {Discord.Message} message
 * @param {SongData[]} songs
 * @param {Map<string, *>} flags
 * @returns
 */
module.exports = (message, songs, flags) => {
    if (!songs.length)
        return new Output().makeError('Tried to add 0 songs to the active queue.').reject();

    const vc = voiceChannel.get(message);

    if (!vc)
        return new Output().makeError('No voice channel.').reject();

    const q = queue.add(message.guild.id, vc.id);

    const connection = voiceChannel.join(message, vc.id);
    queue.get(message.guild.id).connect(connection);

    return process(message, songs, flags, q);
};