const eval = require('./eval');
const vars = require('../../variables/math');
const e = vars.e();

module.exports = {
    log: (expression, base = 10) => {
        return Math.log(eval(expression)) / Math.log(eval(base));
    },
    ln: (expression, base = e) => {
        return log(expression, base);
    } 
}