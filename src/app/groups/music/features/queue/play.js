// eslint-disable-next-line no-unused-vars
const Discord = require('discord.js');
const ytdl = require('ytdl-core');
const { Output } = require('@chrisofnormandy/mariwoah-bot');
const { AudioPlayerStatus } = require('@discordjs/voice');

// eslint-disable-next-line no-unused-vars
const Queue = require('../../helpers/Queue');
// eslint-disable-next-line no-unused-vars
const SongData = require('../../helpers/SongData');

const stop = require('./stop');

/**
 *
 * @param {import('@chrisofnormandy/mariwoah-bot').MessageData} data
 * @param {Queue} q
 * @returns {Promise<Output>}
 */
function next(data, q) {
    let current = q.current();
    q.previousSong = current;
    let nextSong = q.next();

    if (!nextSong)
        return stop(data);

    current = nextSong;

    while (current && current.removed)
        current = current.next();

    if (!current)
        return stop(data);

    return play(data, q);
}

/**
 *
 * @param {import('@chrisofnormandy/mariwoah-bot').MessageData} data
 * @param {Queue} q
 * @returns {Promise<Output>}
 */
function play(data, q) {
    if (!q.songs.length)
        return new Output().makeError('No songs to play.').reject();

    return new Promise((resolve, reject) => {
        /**
         * @type {Readable}
         */
        const stream = q.current().stream || ytdl(
            q.current().url,
            {
                filter: 'audioonly',
                quality: 'highestaudio',
                highWaterMark: 1 << 25
            }
        );

        q.current().setStream(stream);

        // This is not when the song is finished.
        // This is when the video buffer has been filled.
        stream.on('finish', () => {
            q.play(stream)
                .then((embed) => new Output().addEmbed(embed).resolve(resolve))
                .catch((err) => new Output().setError(err).reject(reject));

            q.player.on(AudioPlayerStatus.Idle, () => next(data, q));
        });

        stream.on('error', (error) => {
            q.songs.shift();

            console.error(error);

            next(data, q);
        });
    });
}

module.exports = play;