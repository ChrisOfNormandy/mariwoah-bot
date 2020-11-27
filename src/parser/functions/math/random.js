const eval = require('./eval');

module.exports = (min = 0, max = 1) => {
    const M = eval(max);
    const m = eval(min);
    return m + Math.random() * (M - m);
}