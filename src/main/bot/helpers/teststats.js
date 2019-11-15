module.exports = function (music, gaming, global, fishing, mining, gathering) {
    let results = {
        music: !!music,
        gaming: !!gaming,
        stats: !!gaming.stats,
        music: !!music,
        global: !!global,
        fishing: !!fishing,
        mining: !!mining,
        gathering: !!gathering,
    }

    console.log(results);

    let msg = '';

    for (i in results)
        msg += `${i} - ` + (results[i]) ? 'Loaded' : 'Unloaded' + '\n';

    return msg;
}