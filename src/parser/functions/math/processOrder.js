const regex = require('../../regex');

const order = [
    regex.operations.math.parentheses,
    regex.operations.math.factorial,
    regex.operations.math.modulo,
    regex.operations.math.power,
    regex.operations.math.multiplication,
    regex.operations.math.division,
    regex.operations.math.addition,
    regex.operations.math.subtraction
];

module.exports = order;