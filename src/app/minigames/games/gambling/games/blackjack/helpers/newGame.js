const drawCard = require('../../../helpers/drawCard');

module.exports = function(message) {
    let msgArray = message.content.split(' ');

    if (!msgArray[1]) {
        message.channel.send('Please place a bet.');
        return;
    }
    if (isNaN(msgArray[1])) {
        message.channel.send('Please place a valid bet.');
        return;
    }
    const bet = Math.floor(msgArray[1]);
    if (bet == 0) {
        message.channel.send('Please place a positive whole number bet.');
        return;
    }

    message.channel.send('Starting blackjack...');

    let game = {
        dealerHand: [],
        playerHand: [],
        cardMap: new Map(),
        bet: bet,
        payout: -1
    }

    for (let i = 0; i < 2; i++) {
        let card = drawCard(game.cardMap);
        game.dealerHand.push(card);
        game.cardMap.set(card.index, card);
    }
    for (let i = 0; i < 2; i++) {
        let card = drawCard(game.cardMap);
        game.playerHand.push(card);
        game.cardMap.set(card.index, card);
    }

    let msg = 'Player:\n';
    for (i in game.playerHand) msg += game.playerHand[i].text + '\n';

    message.channel.send(msg);

    return game;
}