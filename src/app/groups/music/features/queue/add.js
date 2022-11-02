const append = require('./append');
const getSong = require('../../helpers/getSong');

const { handlers, Output } = require('@chrisofnormandy/mariwoah-bot');

const { shuffle } = handlers.arrays;

/**
 *
 * @param {import('@chrisofnormandy/mariwoah-bot').MessageData} data
 * @returns {Promise<Output>}
 */
function byName(data) {
    return new Promise((resolve, reject) => {
        getSong.byName(data.message, data.arguments.join(' '))
            .then((song) => append(data.message, [song], data.flags))
            .then(resolve)
            .catch((err) => new Output().setError(err).reject(reject));
    });
}

/**
 *
 * @param {import('@chrisofnormandy/mariwoah-bot').MessageData} data
 * @returns {Promise<Output>}
 */
function byURLArray(data) {
    return new Promise((resolve, reject) => {
        getSong.byURLArray(data.message, data.urls)
            .then((arr) => {
                const songs = data.flags.has('s')
                    ? shuffle(arr)
                    : arr;

                append(data.message, songs, data.flags)
                    .then(resolve)
                    .catch((err) => new Output().setError(err).reject(reject));
            })
            .catch((err) => new Output().setError(err).reject(reject));
    });
}

/**
 *
 * @param {import('@chrisofnormandy/mariwoah-bot').MessageData} data
 * @returns {Promise<Output>}
 */
function byPlaylist(data) {
    return new Promise((resolve, reject) => {
        getSong.byPlaylist(data.arguments.join(' '), data)
            .then((playlistData) => append(data.message, playlistData, data.flags))
            .then(resolve)
            .catch((err) => new Output().setError(err).reject(reject));
    });
}

/**
 *
 * @param {import('@chrisofnormandy/mariwoah-bot').MessageData} data
 * @returns
 */
function add(data) {
    if (data.urls.length)
        return byURLArray(data);

    return data.flags.has('p')
        ? byPlaylist(data)
        : byName(data);
}

module.exports = add;