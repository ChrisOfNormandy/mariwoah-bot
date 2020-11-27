const regex = require('./regex');
const c = [
    regex.conditions.equates,
    regex.conditions.n_equates,
    regex.conditions.greater,
    regex.conditions.lesser,
    regex.conditions.greater_eq,
    regex.conditions.lesser_eq,
    regex.conditions.divisible,
    regex.conditions.n_divisible,
    regex.conditions.and,
    regex.conditions.or,
    regex.conditions.nand,
    regex.conditions.nor,
    regex.conditions.xand,
    regex.conditions.xor,
    regex.conditions.xnand,
    regex.conditions.xnor
];

const f = [
    (a, b) => {return a == b},
    (a, b) => {return a != b},
    (a, b) => {return a > b},
    (a, b) => {return a < b},
    (a, b) => {return a >= b},
    (a, b) => {return a <= b},
    (a, b) => {return a % b == 0},
    (a, b) => {return a % b != 0},
    (a, b) => {return a && b},
    (a, b) => {return a || b},
    (a, b) => {return !(a && b)},
    (a, b) => {return !(a || b)},
    (a, b) => {return a && b},
    (a, b) => {return !(a && b)},
    (a, b) => {return !(a && b)},
    (a, b) => {return a && b},
]

function _(str, index) {
    const g = str.match(c[index]);
    return g.length == 6
        ? f[index](g[1], g[2]) ? 1 : 0
        : f[index](g[1], g[3]) ? 1 : 0;
}

module.exports = (str) => {
    let s = str;
    for (let i in c) {
        while (c[i].test(s))
            s = s.replace(s.match(c[i])[0], _(s, i));
    }
    return s;
}