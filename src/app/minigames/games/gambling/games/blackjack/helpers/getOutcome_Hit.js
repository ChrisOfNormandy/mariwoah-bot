const drawCard = require('../../../helpers/drawCard');
const getHandSum = require('../../../helpers/getHandSum');

module.exports = function (game) {
    let card = drawCard(game.cardMap);
    game.playerHand.push(card);
    game.cardMap.set(card.index, card);

    let total = getHandSum(game.playerHand);
    if (total > 21)
        return null;
    return game;
}