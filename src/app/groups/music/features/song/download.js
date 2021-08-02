const Discord = require('discord.js');
const ytdl = require('ytdl-core');
const { MessageData, Output } = require('@chrisofnormandy/mariwoah-bot');

const fs = require('fs');
const getSong = require('../../helpers/getSong');

/**
 * 
 * @param {string} url 
 * @returns {Promise<Discord.MessageAttachment>}
 */
function get(url) {
    return new Promise((resolve, reject) => {
        const name = ytdl.getURLVideoID(url);
        const path = `temp/video_${name}.mp4`;

        if (!fs.existsSync('temp/'))
            fs.mkdirSync('temp/');

        fs.open(path, (err, data) => {
            if (err) {
                const stream = fs.createWriteStream(path);

                ytdl(url, { quality: 'lowest' }).pipe(stream);

                stream.on('finish', () => resolve(new Discord.MessageAttachment(path)));
            }
            else
                resolve(new Discord.MessageAttachment(path));
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
                .then(results => resolve(new Output(...results).setValues(results).setOption('files', results)))
                .catch(err => reject(new Output().setError(err)));
        });
    }
    else {
        return new Promise((resolve, reject) => {
            getSong.byName({ author: null }, data.arguments.join(' '))
                .then(song => {
                    get(song.url)
                        .then(result => resolve(new Output(result).setValues(result).setOption('files', result)))
                        .catch(err => reject(new Output().setError(err)));
                })
                .catch(err => reject(new Output().setError(err)));
        });
    }
}

module.exports = download;