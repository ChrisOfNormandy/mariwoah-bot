const drawCard = require('../../../helpers/drawCard');
const getHandSum = require('../../../helpers/getHandSum')

module.exports = function (game) {
    const pSum = getHandSum(game.playerHand);
    let dSum = getHandSum(game.dealerHand);
    let outcome = '';

    if (pSum == 21) {
        if (dSum == 21)
            outcome = 'eq';
        else
            outcome = 'pbj';
    }
    else if (dSum == 21) {
        outcome = 'dbj';
    }
    else {
        let card;
        while (dSum < 17) {
            card = drawCard(game.cardMap);
            game.dealerHand.push(card);
            game.cardMap.set(card.index, card);
            dSum += card.face + 1;
        }

        if (dSum == 21)
            outcome = 'dbj';
        else if (dSum > 21)
            outcome = 'db';
        else if (dSum > pSum)
            outcome = 'dg';
        else if (dSum == pSum)
            outcome = 'eq';
        else
            outcome = 'pg';
    }
    return {
        game: game,
        outcome: outcome,
        pSum: pSum,
        dSum: dSum
    }
}