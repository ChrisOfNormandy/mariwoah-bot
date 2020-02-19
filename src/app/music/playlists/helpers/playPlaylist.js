const addToQueue = require('./addQueue');
const paths = require('../../../common/bot/helpers/global/paths');
const readFile = require('../../../common/bot/helpers/files/readFile');

module.exports = async function (message, playlistName, doShuffle = false) {
    readFile(`${paths.getPlaylistPath(message)}${playlistName}.json`)
    .then(obj => {
        addToQueue(obj, message, doShuffle);
    })
    .catch(e => console.log(e));
}