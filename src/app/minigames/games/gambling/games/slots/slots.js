const slotItems = {
    'gem': {
        worth: [0.1, 2, 15]
    },
    'cherries': {
        worth: [0.2, 3, 25]
    },
    'grapes': {
        worth: [0.2, 3, 50]
    },
    'watermelon': {
        worth: [0.3, 3, 75]
    },
    'bell': {
        worth: [0.3, 4, 100]
    },
    'seven': {
        worth: [0.4, 5, 250]
    },
    'fleur_de_lis': {
        worth: [0.5, 10, 1000]
    },
    'x': {
        worth: [-1, -1, -1]
    }
};
const slotItemsList = ['gem', 'cherries', 'grapes', 'watermelon', 'bell', 'seven' ,'fleur_de_lis', 'x'];

function listCombos (message) {
    let msg = '';
    for (s in slotItems) {
        if (s == 'x') msg += `> :${s}: BUST\n`;
        else msg += `> :${s}: = 1/2 ~ ${slotItems[s].worth[0]} | 3/4 ~ ${slotItems[s].worth[1]} | 5 ~ ${slotItems[s].worth[2]}\n`;
    }
    message.channel.send(msg);
}

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

module.exports = {
    slotIcons: slotItemsList,

    roll: function (rolls, bet) {
        return roll(rolls, bet);
    },

    list: function (message) {
        listCombos(message);
    }
}