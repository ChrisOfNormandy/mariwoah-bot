const Discord = require('discord.js');

const { chatFormat, Output } = require('../../../../helpers/commands');

const queue = require('./map');
const stop = require('./stop');
const ytdl = require('ytdl-core');

/**
 * 
 * @param {Discord.Message} message 
 * @param {string} id 
 * @param {*} song 
 * @returns {Promise<Output>}
 */
function next(message, id, song) {
    if (!queue.has(id)) {
        return new Promise((resolve, reject) => {
            stop(message, chatFormat.response.music.queue.end())
                .then(() => reject(new Output().setError(new Error('No queue.'))))
                .catch(err => reject(new Output().setError(err)));
        });
    }

    queue.get(id).previousSong = song;
    queue.get(id).songs.shift();

    return new Promise((resolve, reject) => {
        if (queue.get(id).songs[0]) {
            while (queue.get(id).songs[0].removed)
                queue.get(id).songs.shift();

            play(message, queue.get(id).songs[0]);
        }
        else
            stop(message, chatFormat.response.music.queue.end())
                .then(r => resolve(new Output().setValues(r)))
                .catch(err => reject(new Output().setError(err)));
    });
}

/**
 * 
 * @param {Discord.Message} message 
 * @param {*} song 
 * @returns {Promise<Output>}
 */
function play(message, song) {
    const id = message.guild.id;

    if (!queue.has(id))
        return Promise.reject(new Output().setError(new Error(chatFormat.response.music.queue.no_active())));

    return new Promise((resolve, reject) => {
        queue.get(message.guild.id).dispatcher = queue.get(id).connection.play(ytdl(song.url, { filter: 'audioonly', quality: 'highestaudio', highWaterMark: 1 << 25 }), { highWaterMark: 1 })
            .on('finish', () => next(message, id, song))
            .on('error', error => {
                next(message, id, song);

                reject(new Output(chatFormat.response.music.play.error(song.title)).setError(error));
            });

        queue.get(message.guild.id).dispatcher.setVolumeLogarithmic(queue.get(id).volume / 5);

        resolve(new Output());
    });
}

module.exports = play;