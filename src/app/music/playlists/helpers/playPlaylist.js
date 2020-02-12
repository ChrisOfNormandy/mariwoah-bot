const addToQueue = require('../../general/helpers/addQueue');
const fs = require('fs');
const paths = require('../../../common/bot/helpers/paths');

module.exports = async function (message, playlistName, doShuffle = false) {
    try {
        const m = await message.channel.send(`Starting playlist ${playlistName}.`);

        fs.readFile(`${paths.getPlaylistPath(message)}${playlistName}.json`, function (err, data) {
            if (err)
                return console.log(err);

            let obj = JSON.parse(data);
            m.edit(`Starting playlist ${playlistName}.\nSong count - ${obj.playlist.length}`);
            addToQueue(obj, message, doShuffle);
        });
    }
    catch (e) {
        console.log(e);
    }
}