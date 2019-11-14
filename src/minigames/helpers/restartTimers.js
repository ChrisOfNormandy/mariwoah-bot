module.exports = function (stats) {
    for (i in stats) {
        if (stats[i].mining.timer > 0) {
            stats[i].mining.timer = 0;
            stats[i].mining.pick.inUse = false;
        }
        if (stats[i].fishing.rod.inUse) stats[i].fishing.rod.inUse = false;
        if (stats[i].mining.pick.inUse || stats[i].mining.timer > 0) {

        }
    }
    return stats;
}