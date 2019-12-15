const fs = require('fs');
const readFile = require('../../../common/bot/helpers/readFile');

module.exports = async function (message, path) {
    let msgArray = message.content.split(' ');
    if (msgArray.length < 4) reject(false);

    let playlistName = msgArray[2];
    let index = msgArray[3];
    if (isNaN(index) || index < 1) reject(false);
    index--;

    let obj;
    try { obj = await readFile(`${path}${playlistName}.json`);}
    catch (e) {
        console.log(e);
        reject(false);
    }

    let list = obj.playlist;
    let newList = [];
    if (index > list.length) reject(false);
    for (i in list)
        if (i != index) newList.push(list[i]);

    obj.playlist = newList;

    return new Promise( function(resolve, reject) {
        fs.writeFile(path + playlistName + '.json', JSON.stringify(obj), (err, data) => {
            if (err) {
                console.log(err);
                reject(false);
            }
            resolve(true);
        });
    });
}