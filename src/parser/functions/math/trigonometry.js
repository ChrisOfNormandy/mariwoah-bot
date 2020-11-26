const eval = require('./eval');

module.exports = {
    sin: (expression) => {
        return Math.sin(eval(expression));
    },
    cos: (expression) => {
        return Math.cos(eval(expression));
    },
    tan: (expression) => {
        return Math.tan(eval(expression));
    }
}