const readFile = require('../../../common/bot/helpers/file/read');
const statsPath = require('../../../common/bot/helpers/global/paths').stats;

module.exports = function () {
    let map = new Map();
    readFile(statsPath)
        .then(stats => {
            for (let id in stats) {
                if (map.has(id))
                    continue;
                map.set(id, stats[id]);
            }
        })
        .catch(e => console.log(e));
    return map;
}