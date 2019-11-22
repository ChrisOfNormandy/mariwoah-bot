const getOutcome_Fold = require('./getOutcome_Fold');
const getOutcome_Hit = require('./getOutcome_Hit');
const getPayout = require('./getPayout');
const listHand = require('../../../helpers/listHand');

function end(message, game, instances) {
    console.log('END OF BLACKJACK GAME. RETURNING.');
    message.channel.send(`**Payout**: $${game.payout * game.bet}. **Earned**: $${(game.payout * game.bet) - game.bet}.`);
    instances.delete(message.author.id);
    return {
        game: game,
        instances: instances
    }
}

module.exports = function(message, game, instances) {
    msgArray = message.content.split(' ');

    if (!msgArray[1]) {
        message.channel.send('There is a game instance already.');
        return;
    }
    
    switch (msgArray[1]) {
        case 'hit': {
            message.channel.send('Player chose to draw another card.');

            let outcome = getOutcome_Hit(game);

            if (outcome == null) {
                message.channel.send(`Player went bust. Dealer wins.`);
                game.payout = 0;
                return end(message, game);
            }
            else game = outcome;

            message.channel.send(`Player:\n${listHand(game.playerHand)}`);
            return;
        }
        case 'fold': {
            let result = getOutcome_Fold(game);
            let payout = 0;
            game = result.game;

            let payoutObj = getPayout(result.outcome);
            payout = payoutObj.payout;

            message.channel.send('Player decided to fold.')
            .then(m => {
                m.edit(`${m.content}\nPlayer had a ${result.pSum}. Dealer had a ${result.dSum}.${payoutObj.message}`);
            })
            .catch(e => {
                console.log(e);
            });

            let msg = 'Player:\n';
            for (i in game.playerHand) msg += game.playerHand[i].text + '\n';
            msg += 'Dealer:\n';
            for (i in game.dealerHand) msg += game.dealerHand[i].text + '\n';
            message.channel.send(msg);
            game.payout = payout;

            return end(message, game, instances);
        }
        default: {
            return;
        }
    }
}