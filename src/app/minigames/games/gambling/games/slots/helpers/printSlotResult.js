const slots = require('../adapter');

module.exports = function (obj, bet) {
    let msg = '> |#######################|\n> **||** ';

    for (i in obj.reels) {
        msg += `**=**:${slots.slotIcons[obj.reels[i]]}:**=**`
        if (i < obj.reels.length - 1) msg += '|';
    }

    msg += 
    ' **||**\n' + 
    '> |#######################|\n' +
    `> |###| Payout~ $${obj.payout} **||** Earned: $${obj.payout - bet}\n` +
    '> |#######################|\n';
    return msg;
}