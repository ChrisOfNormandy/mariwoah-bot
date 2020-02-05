module.exports = function(map) {
    let stats = {};
    for (let [key, val] of map)
        stats[key] = val;
    return stats;
}