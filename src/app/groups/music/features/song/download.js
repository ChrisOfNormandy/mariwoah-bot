const ytdl = require('ytdl-core');
const getSong = require('../../helpers/getSong');

const { Output, Discord } = require('@chrisofnormandy/mariwoah-bot');

/**
 *
 * @param {string} url
 * @returns {Promise<Discord.MessageAttachment>}
 */
function get(url, audioOnly = false) {
    const options = {
        quality: 'lowest',
        // filter: 'audioonly',
        highWaterMark: 1 << 25
    };

    if (audioOnly)
        options.filter = 'audioonly';

    const p = ytdl(url, options);

    const buffers = [];

    return new Promise((resolve, reject) => {
        p.on('data', (c) => {
            buffers.push(c);
        });

        p.on('end', () => {
            const buffer = Buffer.concat(buffers);

            console.log(buffer.length);

            if (buffer.length / 1024 / 1024 < 8) {
                const attachment = new Discord.AttachmentBuilder(buffer, { name: 'ytdl_download.mp4', description: 'Downloaded from YouTube,' }).attachment;

                resolve({ attachment, name: 'ytdl_download.mp4' });
            }
            else
                reject(new Error('Video too long / file size greater than 8MB.'));
        });
    });
}

/**
 *
 * @param {import('@chrisofnormandy/mariwoah-bot').MessageData} data
 * @returns {Promise<Output>}
 */
function download(data) {
    if (data.urls.length) {
        return new Promise((resolve, reject) => {
            Promise.all(data.urls.map((url) => get(url, data.flags.has('a'))))
                .then((results) => new Output().addFile(...results).setValues(results).setOption('files', results).resolve(resolve))
                .catch((err) => new Output().setError(err).reject(reject));
        });
    }

    return new Promise((resolve, reject) => {
        getSong.byName({ author: null }, data.arguments.join(' '))
            .then((song) => get(song.url, data.flags.has('a')))
            .then((result) => new Output().addFile(result).setValues(result).setOption('files', result).resolve(resolve))
            .catch((err) => new Output().setError(err).reject(reject));
    });

}

module.exports = download;