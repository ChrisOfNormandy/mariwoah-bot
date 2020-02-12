const fishlist = require('../../../helpers/items/itemlist').fish;

module.exports = function (fishType) {
    try {
        let fish = fishlist.common[fishType];
        let msg =
            `Here's some facts:\n` +
            `> Water type: ${fish.type}\n` +
            `> Time of day for catching: ${fish.time}\n` +
            `> Size: ${fish.minSize}" - ${fish.maxSize}"\n` +
            `> Weight: ${fish.weightFunc(fish.minSize).toFixed(2)} lbs - ${fish.weightFunc(fish.maxSize).toFixed(2)} lbs\n` +
            `> Average cost per lb: $${fish.costPerLb.toFixed(2)}\n` +
            '> \n' +
            `> More info: ${fish.link}`;

        return msg;
    }
    catch (e) {
        console.log(e);
    }
    return 'Oops! Had a problem getting a list of fish - sorry...';
}