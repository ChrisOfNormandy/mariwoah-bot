const append = require('./append');
const getSong = require('../../helpers/getSong');

const { handlers } = require('@chrisofnormandy/mariwoah-bot');

const { shuffle } = handlers.arrays;

/**
 * 
 * @param {Discord.Message} message 
 * @param {MessageData} data 
 * @returns {Promise<Output>}
 */
function byName(message, data) {
    return new Promise((resolve, reject) => {
        getSong.byName(message, data.arguments.join(' '))
            .then((song) => {
                append(message, [song], data.flags)
                    .then((r) => resolve(r))
                    .catch((err) => reject(err));
            })
            .catch((err) => reject(err));
    });
}

/**
 * 
 * @param {Discord.Message} message 
 * @param {MessageData} data 
 * @returns {Promise<Output>}
 */
function byURLArray(message, data) {
    return new Promise((resolve, reject) => {
        getSong.byURLArray(message, data.urls)
            .then((arr) => {
                if (data.flags.has('s')) {
                    const songs = shuffle(arr);

                    append(message, songs, data.flags)
                        .then((r) => resolve(r))
                        .catch((err) => reject(err));
                }
                else {
                    append(message, arr, data.flags)
                        .then((r) => resolve(r))
                        .catch((err) => reject(err));
                }
            })
            .catch((err) => reject(err));
    });
}

/**
 * 
 * @param {Discord.Message} message 
 * @param {MessageData} data 
 * @returns {Promise<Output>}
 */
function byPlaylist(message, data) {
    return new Promise((resolve, reject) => {
        getSong.byPlaylist(message, data.arguments.join(' '), data)
            .then((playlistData) => {
                append(message, playlistData, data.flags)
                    .then((r) => resolve(r))
                    .catch((err) => reject(err));
            })
            .catch((err) => reject(err));
    });
}

/**
 * 
 * @param {Discord.Message} message 
 * @param {MessageData} data 
 * @returns 
 */
module.exports = (message, data) => {
    if (data.urls.length)
        return byURLArray(message, data);

    return (data.flags.has('p'))
        ? byPlaylist(message, data)
        : byName(message, data);
};