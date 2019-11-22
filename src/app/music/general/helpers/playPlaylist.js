const fs = require('fs');

const music = require('../music');
const addToQueue = require('./addQueue');
const global = require('../../../common/core');

module.exports = async function (message) {
    const msgArray = message.content.split(' ');

    try {
        const m = await message.channel.send(`Starting playlist ${msgArray[2]}.`);

        fs.readFile(`${global.playlistPath}${msgArray[2]}.json`, function (err, data) {
            if (err) {
                console.log(err);
                return;
            }
        
            let obj = JSON.parse(data);
            m.edit(`Starting playlist ${msgArray[2]}.\nSong count - ${obj.playlist.length}`);
            let shuffle;
            if (msgArray[3] === '-s') shuffle = true;
            else shuffle = false;
            addToQueue(obj, message, shuffle);
        });
    }
    catch (e) {
        console.log(e);
    }
}