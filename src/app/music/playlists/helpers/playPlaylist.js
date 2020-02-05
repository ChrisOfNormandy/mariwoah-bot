const fs = require('fs');
const addToQueue = require('../../general/helpers/addQueue');
const paths = require('../../../common/bot/helpers/paths');

module.exports = async function (message) {
    const msgArray = message.content.split(' ');
    console.log(paths.playlists);

    try {
        const m = await message.channel.send(`Starting playlist ${msgArray[2]}.`);

        fs.readFile(`${paths.playlists}${msgArray[2]}.json`, function (err, data) {
            if (err) {
                console.log(err);
                return;
            }

            let obj = JSON.parse(data);
            m.edit(`Starting playlist ${msgArray[2]}.\nSong count - ${obj.playlist.length}`);
            let bool = msgArray[3] == '-s';
            addToQueue(obj, message, bool);
        });
    }
    catch (e) {
        console.log(e);
    }
}