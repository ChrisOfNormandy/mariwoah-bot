const Discord = require('discord.js');
const fs = require('fs');
const ytdl = require('ytdl-core');
const getSong = require('../../helpers/getSong');
const {output} = require('../../../../helpers/commands');


function get(url) {
    return new Promise((resolve, reject) => {
        const name = ytdl.getURLVideoID(url);
        const path = `temp/video_${name}.mp4`

        fs.open(path, (err, data) => {
            if (err) {
                console.log(path, '- Does not exist. Downloading!')
                const stream = fs.createWriteStream(path);

                ytdl(url, { quality: 'lowest'}).pipe(stream);

                stream.on('finish', () => {
                    console.log('Finished downloading: ', name);
                    resolve(new Discord.MessageAttachment(path));
                });
            }                
            else {
                console.log(path, '- Exists. Fetching!')
                resolve(new Discord.MessageAttachment(path));
            }
        });        
    });
}

function download(data) {
    let arr = [];
    
    if (data.urls.length) {
        for (let i in data.urls)
            arr.push(get(data.urls[i]));
        
        return new Promise((resolve, reject) => {
            Promise.all(arr)
                .then(results => resolve(output.valid(results, [`Please wait while things are uploaded.\nLonger videos take more time to download and upload.`, {files: results}])))
                .catch(e => reject(output.error([e], [])));
            });
    }       
    else {
        return new Promise((resolve, reject) => {
        getSong.byName({author: null}, data.arguments.join(' '))
            .then(song => {
                get(song.url)
                    .then(result => resolve(output.valid([result], [`Please wait while things are uploaded.\nLonger videos take more time to download and upload.`, {files: [result]}])))
                    .catch(e => reject(output.error([e], [])));
            })
            .catch(e => reject(output.error([e], [])));
        });
    }    
}

module.exports = download;