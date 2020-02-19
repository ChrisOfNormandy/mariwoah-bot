const fs = require('fs');
const readFile = require('../../../common/bot/helpers/readFile');
const paths = require('../../../common/bot/helpers/paths');

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
        fs.writeFile(`${paths.getPlaylistPath(message)}${playlistName}.json`, JSON.stringify(obj), (err) => {
            if (err)
                reject(err);
            resolve(newList);
        });
    });
}