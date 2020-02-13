const addToQueue = require('../../general/helpers/addQueue');
const fs = require('fs');
const paths = require('../../../common/bot/helpers/paths');

module.exports = async function (message, playlistName, doShuffle = false) {
    try {
        fs.readFile(`${paths.getPlaylistPath(message)}${playlistName}.json`, function (err, data) {
            if (err)
                return console.log(err);

            let obj = JSON.parse(data);
            
            addToQueue(obj, message, doShuffle);
        });
    }
    catch (e) {
        console.log(e);
    }
}