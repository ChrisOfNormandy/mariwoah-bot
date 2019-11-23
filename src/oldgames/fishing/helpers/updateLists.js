const global = require('../../../main/global');
const itemlist = require('../../itemList');
const fishlist = itemlist.fish;
const fishlootlist = itemlist.fishloot;

module.exports = function (flag) {
    let toReturn = {
        fish: [],
        items: []
    };
    if (flag === 'f' || flag === 'a') {
        for (i in fishlist.common) {
            try {
                if (fishlist.common[i].minSize && fishlist.common[i].maxSize)
                    toReturn.fish.push(i);
            }
            catch (e) {
                global.log('Exception: Error updating available fish.', 'error');
                console.log(e);
            }
        }
        global.log('Updated available fish.', 'info');
    }
    if (flag === 'i' || flag === 'a') {
        for (i in fishlootlist.common) {
            try {
                if (fishlootlist.common[i].minSize && fishlootlist.common[i].maxSize) {
                    toReturn.items.push(i);
                }
            }
            catch (e) {
                global.log('Exception: Error updating available fishing items.', 'error');
                console.log(e);
            }
        }
        global.log('Updated available items.', 'info');
    }

    return toReturn;
}