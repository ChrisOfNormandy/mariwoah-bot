module.exports = function (value) {
    let msg = '';
    let payout = 0;

    switch (value) {
        case 'pbj': {
            msg = `\nPlayer wins with 21.`;
            payout = 2;
            break;
        }
        case 'dbj': {
            msg = `\nDealer wins with 21.`;
            break;
        }
        case 'eq': {
            msg = `\nPlayer and dealer tied, player gets 1/2 return.`;
            payout = 1.5;
            break;
        }
        case 'dg': {
            msg = `\nDealer wins with a greater hand.`;
            break;
        }
        case 'db': {
            msg = `\nDealer went bust; player wins.`;
            payout = 2;
            break;
        }
        case 'pg': {
            msg = `\nPlayer wins with a greater hand.`;
            payout = 2;
            break;
        }
        default: {
            msg = `\nThere's a glitch in the matrix...`;
            break;
        }
    }
    return {
        message: msg,
        payout: payout
    }
}