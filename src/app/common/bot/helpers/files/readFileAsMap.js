const readFile = require('./readFile');
const listDir = require('./listDir');

async function toMap(path, map, list, index) {
    return new Promise(async function (resolve, reject) {
        if (index < list.length) {
            fileName = list[index].split('_')[1].split('.')[0];

            readFile(path + list[index])
                .then(obj => {
                    map.set(fileName, obj);
                    toMap(path, map, list, index + 1)
                        .then(r => resolve(r))
                        .catch(e => reject(e));
                })
                .catch(e => reject(e));
        }
        else {
            resolve(map);
        }
    })
}

module.exports = async function (path, filename = null, objectName = null) {
    return new Promise(async function (resolve, reject) {
        if (filename == null) {
            listDir(path)
                .then(async function (list) {
                    resolve(toMap(path, new Map(), list, 0))
                })
                .catch(e => reject(e));
        }
        else {
            readFile(path + filename)
                .then(obj => {
                    let map = new Map();
                    if (objectName)
                        map.set(objectName, obj);
                    else
                        map.set(filename, obj);
                    resolve(map);
                })
                .catch(e => reject(e));
        }
    })
}