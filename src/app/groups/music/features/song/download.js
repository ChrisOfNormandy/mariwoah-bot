const fs = require('fs');
const ytdl = require('ytdl-core');
const getSong = require('../../helpers/getSong');

const { Output } = require('@chrisofnormandy/mariwoah-bot');

/**
 * 
 * @param {string} url 
 * @returns {Promise<Discord.MessageAttachment>}
 */
function get(url) {
    return new Promise((resolve) => {
        const name = ytdl.getURLVideoID(url);
        const path = `temp/video_${name}.mp4`;

        if (!fs.existsSync('temp/'))
            fs.mkdirSync('temp/');

        fs.open(path, (err) => {
            if (err) {
                const stream = fs.createWriteStream(path);

                ytdl(url, { quality: 'lowest' }).pipe(stream);

                stream.on('finish', () => resolve({ attachment: path, name: 'ytdl_download.mp4', description: 'Downloaded from YouTube.' }));
            }
            else
                resolve({ attachment: path, name: 'ytdl_download.mp4', description: 'Downloaded from YouTube.' });
        });
    });
}

/**
 * 
 * @param {MessageData} data 
 * @returns {Promise<Output>}
 */
function download(data) {
    let arr = [];

    if (data.urls.length) {
        for (let i in data.urls)
            arr.push(get(data.urls[i]));

        return new Promise((resolve, reject) => {
            Promise.all(arr)
                .then((results) => resolve(new Output().addFile(...results).setValues(results).setOption('files', results)))
                .catch((err) => reject(new Output().setError(err)));
        });
    }

    return new Promise((resolve, reject) => {
        getSong.byName({ author: null }, data.arguments.join(' '))
            .then((song) => {
                get(song.url)
                    .then((result) => resolve(new Output().addFile(result).setValues(result).setOption('files', result)))
                    .catch((err) => reject(new Output().setError(err)));
            })
            .catch((err) => reject(new Output().setError(err)));
    });

}

module.exports = download;