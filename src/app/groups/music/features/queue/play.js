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
 * @param {Discord.Message} message 
 * @param {Queue} q 
 * @returns {Promise<Output>}
 */
function next(message, q) {
    q.previousSong = q.songs[0];

    let nextSong = q.songs[0].next;

    console.log('Next:', nextSong);

    if (!nextSong)
        q.songs.shift();

    while (q.songs[0] && q.songs[0].removed)
        q.songs.shift();

    return new Promise((resolve, reject) => {
        if (!q.songs[0]) {
            stop(message)
                .then((r) => resolve(r))
                .catch((err) => reject(err));
        }
        else {
            play(message, q)
                .then((r) => resolve(r))
                .catch((err) => reject(err));
        }
    });
}

/**
 * 
 * @param {Discord.Message} message 
 * @param {Queue} q 
 * @returns {Promise<Output>}
 */
function play(message, q) {
    return new Promise((resolve, reject) => {
        if (!q.songs.length) {
            reject(new Output().setError(new Error('No songs to play.')));
        }
        else {
            /**
             * @type {Readable}
             */
            let stream;
            if (q.current().stream)
                stream = q.current().stream;
            else {
                stream = ytdl(
                    q.current().url,
                    {
                        filter: 'audioonly',
                        quality: 'highestaudio',
                        highWaterMark: 1 << 25
                    }
                );
            }

            q.current().setStream(stream);

            // This is not when the song is finished.
            // This is when the video buffer has been filled.
            stream.on('finish', () => {
                q.play(stream)
                    .then((r) => resolve(r))
                    .catch((err) => reject(err));

                q.player.on(AudioPlayerStatus.Idle, () => {
                    next(message, q)
                        .then((r) => resolve(r))
                        .catch((err) => reject(err));
                });
            });

            stream.on('error', (error) => {
                q.songs.shift();
                next(message, q)
                    .then((r) => reject(new Output(`Failed to play ${q.songs[0].title}.`).setValues(r).setError(error)))
                    .catch((err) => reject(new Output().setError(err)));
            });
        }
    });
}

module.exports = play;