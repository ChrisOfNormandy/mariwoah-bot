const readFile = require('../../../common/bot/helpers/files/readFile');
const paths = require('../../../common/bot/helpers/global/paths');
const writeFile = require('../../../common/bot/helpers/files/writeFile');

module.exports = async function (message, playlistName, index) {
    let obj;
    try {
        obj = await readFile(`${paths.getPlaylistPath(message)}${playlistName}.json`);
    }
    catch (e) {
        return console.log(e);
    }

    let list = obj.playlist;
    let newList = [];
    index--;
    
    if (index > list.length)
        return;
    for (i in list)
        if (i != index)
            newList.push(list[i]);

    obj.playlist = newList;

    return new Promise(function (resolve, reject) {
        writeFile(`${paths.getPlaylistPath(message)}${playlistName}.json`, obj)
            .then(r => resolve(r))
            .catch(e => reject(e));
    });
}