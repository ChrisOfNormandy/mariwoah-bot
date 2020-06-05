module.exports = function (map) {
    let obj = {};
    for (let [key, val] of map)
        obj[key] = val;
    return obj;
}