const pullStats = require('./pullStats');

module.exports = function() {
    let map = new Map();
    pullStats()
    .then(stats => {
        for (obj in stats) {
            if (map.has(obj.user.id)) continue;
            map.set(obj.user.id, obj);
        }
    })
    .catch(e => {console.log(e);});
    return map;
}