const fs = require('fs');
const ytdl = require('ytdl-core');

module.exports = async function(message, path) {
    let msgArray = message.content.split(' ');
    if (msgArray.length < 4) return;

    let playlistName = msgArray[2];
    ytdl.getInfo(msgArray[3])
    .then(songInfo => {
        const song = {
            title: songInfo.title,
            url: songInfo.video_url,
        };
        
        return new Promise(function(resolve, reject) {
            fs.readFile(path + playlistName + '.json', 'utf8', (err, data) => {
                if (err) reject(false);
                else {
                    let obj = (!data) ? {"playlist": []} : JSON.parse(data);
                    obj.playlist.push(song);
                    
                    json = JSON.stringify(obj);
                    fs.writeFile(path + playlistName + '.json', json, 'utf8', (err, data) => {
                        if (err) reject(false);
                        else resolve(true);
                    });
                }
            });
        })
    })
    .catch(e => {
        console.log(e);
        message.channel.send(e.message);
    })
}