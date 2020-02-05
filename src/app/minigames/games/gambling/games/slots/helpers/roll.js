const rollList = require('./rollList');
const slotItems = rollList.items;
const slotItemsList = rollList.list;

function roll(rolls, bet) {
    let items = 0;
    for (i in slotItems) items++;

    let reels = new Array(rolls);
    reels = _roll(reels, 0, items);
    console.log(reels);

    let payout = getPayout(bet, reels);
    console.log(payout);

    return {
        reels: reels,
        payout: payout
    }
}

function _roll(arr, index, items) {
    arr[index] = (Math.floor(Math.random() * items));

    if (index < arr.length - 1)
        _roll(arr, index + 1, items);
    return arr;
}

function getPayout (payin, reels) {
    let payout = 0;
    let obj = getTotals(reels);
    if (obj['x'] > 0) return 0;

    for (s in obj) {
        if (obj[s] == 0) continue;

        if (obj[s] > 0 && obj[s] <= 2) payout += obj[s] * slotItems[s].worth[0];
        if (obj[s] > 2 && obj[s] <= 4) payout += (obj[s] - 2) * slotItems[s].worth[1];
        else if (obj[i] >= 5) payout += slotItems[s].worth[2];

        console.log(payout);
    }

    console.log(obj);
    return Number((payin * payout).toFixed(2));
}

function getTotals (arr) {
    let obj = {}
    for (let i = 0; i < slotItemsList.length; i++) {
        obj[slotItemsList[i]] = 0;
    }

    for (let i = 0; i < arr.length; i++) {
        obj[slotItemsList[arr[i]]]++;
    }

    return obj;
}

module.exports = function(rolls, bet) {
    return roll(rolls, bet);
}