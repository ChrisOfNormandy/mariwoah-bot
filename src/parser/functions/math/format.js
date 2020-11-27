const eval = require('./eval');

function round(number, amount) {
    return amount == 0
        ? Math.round(number)
        : Math.round(number * Math.pow(10, amount)) / Math.pow(10, amount);
}

function floor(number, amount) {
    return amount == 0
        ? Math.floor(number)
        : Math.floor(number * Math.pow(10, amount)) / Math.pow(10, amount);
}

function scientific(number, places, useE) {
    const n = Number(number.split('.')[0]);
    if (n == 0) {
        const dec = number.split('.')[1];
        let i = dec.length - 1;
        while (dec[i] == 0)
            i--;
        i--;
        const p = i - dec.length - 1;
        const m = Number(dec) * Math.pow(10, -1 * (Number(dec).toString().length - 1));
        return `${round(m, places)}${useE == 1 ? 'e': 'x10^'}${p}`;
    }
    const p = n.toString().length - 1;
    const m = n / Math.pow(10, p);
    return `${round(m, places)}${useE == 1 ? 'e': 'x10^'}${p}`;
}

module.exports = {
    round: (expression, amount = 0) => {return round(eval(expression), amount);},
    floor: (expression, amount = 0) => {return floor(eval(expression), amount);},
    scientific: (expression, places = 3, useE = 1) => {return scientific(eval(expression), places, useE);},
}