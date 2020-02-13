const pullStats = require('./pullStats');

module.exports = function () {
    let map = new Map();
    pullStats()
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