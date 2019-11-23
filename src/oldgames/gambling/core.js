const gaming = require('../gaming');
const slots = require('./helpers/slots');
const printSlotResult = require('./helpers/printSlotResult');
const blackjack = require('./helpers/blackjack');

module.exports = {
    roll: function (message, bet, rollAmt) {
        let rollCount = 1;
        if (!isNaN(rollAmt)) {
            rollCount = Math.floor(rollAmt);
        }
        message.channel.send(`> Starting slots using $${bet} ${rollCount} times.`);

        message.channel.send('> Rolling slots...')
        .then(m => {
            gaming.getUser(message)
            .then(user => {
                if (isNaN(bet)) {
                    m.edit('> Bet value was not a number.');
                    return;
                }

                bet = Math.floor(bet);

                if (bet <= 0) {
                    m.edit('> Bet value should be a whole number greater than 0.');
                    return;
                }
                if (user.stats.money < bet) {
                    m.edit('> Your balance was too low to bet that amount.');
                    return;
                }
                let obj;
                    
                if (rollCount == 1) {
                    obj = slots.roll(5, bet);
                    m.edit(printSlotResult(obj, bet));
                    user.stats.money += Number((obj.payout - bet).toFixed(2));
                    message.channel.send(`New balance: $${user.stats.money}`);
                }
                else {
                    let betPerRoll = Math.floor(bet / rollCount);
                    if (betPerRoll == 0) return;

                    let payout = 0;
                    let bustCount = 0;
                    let count = rollCount;

                    while (count > 0) {
                        obj = slots.roll(5, betPerRoll);
                        payout += obj.payout - betPerRoll;
                        if (obj.payout == 0) bustCount++;
                        count--;
                    }
                    payout = Number(payout.toFixed(2));
                    user.stats.money += payout;
                    message.channel.send(`After rolling ${rollCount} times at $${betPerRoll} each,\nyou earned ${payout}.\nYou went bust ${bustCount} times.\n\nNew balance: $${user.stats.money}`);
                }
            })
            .catch(e => {
                console.log(e);
            })
        })
        .catch(e => {
            console.log(e);
        })
    },

    list: function (message) {
        slots.list(message);
    },

    blackJack: function (message) {
        let payout = blackjack(message);
        console.log(`blackJack result:`);
        console.log(payout);
        if (payout != undefined) {
            return (payout.bet * payout.payout) - payout.bet;
        }
        return null;
    }
}