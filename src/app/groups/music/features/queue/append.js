const Discord = require('discord.js');

const { chatFormat, Output } = require('../../../../helpers/commands');

const shuffle = require('../../../../helpers/shuffle');
const queue = require('./map');
const getVC = require('../../../../helpers/getVoiceChannel');
const play = require('./play');
const getEmbed = require('../../helpers/getEmbedSongInfo');

/**
 * 
 * @param {Discord.Message} message 
 * @param {*} songs 
 * @param {Map} flags 
 * @param {*} startFlag 
 * @returns {Promise<Output>}
 */
function f(message, songs, flags, startFlag) {
    return new Promise((resolve, reject) => {
        for (let i in songs)
            queue.get(message.guild.id).songs.push(songs[i]);

        if (flags.has('n'))
            play(message, queue.get(message.guild.id).songs[0])
                .then(r => resolve(r))
                .catch(err => reject(err));
        else {
            let fromPlaylist = !!queue.get(message.guild.id).songs[0].playlist.title;

            if (startFlag) {
                getEmbed.single('Now playing...', queue.get(message.guild.id), 0, fromPlaylist)
                    .then(embed => resolve(new Output(embed).setValues(play(message, queue.get(message.guild.id).songs[0])).setOption('clear', queue.get(message.guild.id).songs[0].duration.seconds)))
                    .catch(err => reject(new Output().setError(err)));
            }
            else {
                getEmbed.single('Added to queue:', queue.get(message.guild.id), queue.get(message.guild.id).songs.length - 1, fromPlaylist)
                    .then(embed => resolve(new Output(embed).setValues(queue.get(message.guild.id).songs)))
                    .catch(err => reject(new Output().setError(err)));
            }
        }
    });
}

/**
 * 
 * @param {Discord.Message} message 
 * @param {Map} flags 
 * @param {*} songs 
 * @param {*} startFlag 
 * @returns {Promise<Output>}
 */
function p(message, flags, songs, startFlag) {
    return new Promise((resolve, reject) => {
        if (!!flags.s)
            shuffle(songs)
                .then(songs => {
                    f(message, songs, flags, startFlag)
                        .then(res => resolve(res))
                        .catch(err => reject(err));
                })
                .catch(err => reject(new Output().setError(err)));
        else
            f(message, songs, flags, startFlag)
                .then(res => resolve(res))
                .catch(err => reject(err));
    });
}

/**
 * 
 * @param {Discord.Message} message 
 * @param {*} songs 
 * @param {Map} flags 
 * @returns {Promise<Output>}
 */
module.exports = (message, songs, flags = {}) => {
    return new Promise((resolve, reject) => {
        if (!songs.length)
            reject(new Output().setError(new Error('Tried to add 0 songs to the active queue.')));
        else {
            const voiceChannel = getVC(message);
            let startFlag = false;

            if (!voiceChannel)
                reject(new Output().setError(new Error(chatFormat.response.music.no_vc())));
            else {
                if (!queue.has(message.guild.id) || !queue.get(message.guild.id).active) {
                    let activeQueue = {
                        voiceChannel: voiceChannel,
                        connection: null,
                        songs: [],
                        volume: 5,
                        active: true,
                        previousSong: null,
                        dispatcher: null
                    };

                    queue.set(message.guild.id, activeQueue);
                    startFlag = true;
                }

                if (queue.get(message.guild.id).connection === null) {
                    voiceChannel.join()
                        .then(connection => {
                            queue.get(message.guild.id).connection = connection;

                            p(message, flags, songs, startFlag)
                                .then(r => resolve(r))
                                .catch(err => reject(err));
                        })
                        .catch(err => reject(new Output().setError(err)));
                }
                else
                    p(message, flags, songs, startFlag)
                        .then(r => resolve(r))
                        .catch(err => reject(err));
            }
        }
    });
};