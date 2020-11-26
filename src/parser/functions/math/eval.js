const order = require('./processOrder');

const evals = [
    (arr) => {
        let f = arr[1];
        for (let i in order) {
            f = recur_eval(f, i);
        }
        return f;
    },
    (arr) => {
        let a = Number(arr[1]);
        let count = a - 1;
        while (count >= 2) {
            a *= count;
            count--;
        }
        return a;
    },
    (arr) => {
        let a = Number(arr[1]);
        let b = Number(arr[3]);
        return Number(a % b);
    },
    (arr) => {
        let a = Number(arr[1]);
        let b = Number(arr[3]);
        return Math.pow(a, b);
    },
    (arr) => {
        let a = Number(arr[1]);
        let b = Number(arr[3]);
        return Number(a * b);
    },
    (arr) => {
        let a = Number(arr[1]);
        let b = Number(arr[3]);
        return Number(a / b);
    },
    (arr) => {
        console.log(arr);
        let a = Number(arr[1]);
        let b = Number(arr[3]);
        return Number(a + b);
    },
    (arr) => {
        let a = Number(arr[1]);
        let b = Number(arr[3]);
        return Number(a - b);
    },
]

function recur_eval(expression, index) {
    let f = expression;

    let s = f.match(order[index]);
    console.log(s);
    while (s !== null) {
        let val = evals[index](s);

        f = f.replace(s[0], val);
        s = f.match(order[index]);
    }

    return f;
}

module.exports = (expression) => {
    let f = expression;
    console.log('Evaluating: ', f);
    for (let i in order) {
        f = recur_eval(f, i);
    }
    return f;
}