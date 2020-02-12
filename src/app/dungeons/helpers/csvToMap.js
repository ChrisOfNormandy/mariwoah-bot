const fs = require('fs');
const paths = require('../../common/bot/helpers/paths');
const equipmentMap = require('./equipmentMap');

module.exports = async function () {
    return new Promise(function (resolve, reject) {
        fs.readFile(paths.dungeonList, function (err, data) {
            if (err)
                reject(err);

            let array = data.toString().split("\n");
            let map = new Map();

            let arr, a, o;

            for (let i in array) {
                arr = array[i].split(',');

                a = {
                    name: arr[0],
                    cost: arr[1],
                    weight: arr[2],
                    class: arr[3],
                    note: arr[4]
                };

                if (map.has(a.class))
                    map[a.class][a.name] = a;
                else {
                    if (!a.class)
                        continue;

                    map.set(a.class, {});
                    o = {};
                    o[a.name] = a;
                    map[a.class] = o;
                }
            }
            resolve(map);
        });
    });
}