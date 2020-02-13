const blackjack = require('./games/blackjack/adapter');
const slots = require('./games/slots/adapter');

module.exports = {
    slots: function (message, bet, rollAmt) {
        let rollCount = 1;
        if (!isNaN(rollAmt))
            rollCount = Math.floor(rollAmt);

        message.channel.send(`> Starting slots using $${bet} ${rollCount} times.`)
            .then(msg => setTimeout(() => {
                try {
                    msg.delete();
                }
                catch (e) {
                    message.channel.send('I require admin permissions to operate correctly.');
                }
            }, 3000))
            .then(setTimeout(() => {
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
                                    if (betPerRoll == 0)
                                        return;

                                    let payout = 0;
                                    let bustCount = 0;
                                    let count = rollCount;

                                    while (count > 0) {
                                        obj = slots.roll(5, betPerRoll);
                                        payout += obj.payout - betPerRoll;
                                        if (obj.payout == 0)
                                            bustCount++;
                                        count--;
                                    }
                                    payout = Number(payout.toFixed(2));
                                    user.stats.money += payout;
                                    message.channel.send(`After rolling ${rollCount} times at $${betPerRoll} each,\nyou earned ${payout}.\nYou went bust ${bustCount} times.\n\nNew balance: $${user.stats.money}`);
                                }
                            })
                            .catch(e => console.log(e))
                    })
                    .catch(e => console.log(e))
            }, 3000)
            )


    },

    list: function (message) {
        slots.list(message);
    },

    blackjack: function (message, user) {
        let obj = blackjack.execute(message, user);
        if (obj != null)
            return (obj.bet * obj.payout) - obj.bet;
        return null;
    },

    slots: function (message, user) {
        let obj = slots.execute(message, user);
        if (obj != null)
            return (obj.bet * obj.payout) - obj.bet;
        return null;
    },

    run: function (message, game, getUser) {
        let user = getUser(message);
        switch (game) {
            case 'blackjack': {
                return this.blackjack(message, user);
            }
            case 'slots': {
                return this.slots(message, user);
            }
        }
    }
}