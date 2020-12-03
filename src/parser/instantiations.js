const regex = require('./regex');

const order = [
    regex.operations.negate,
    regex.operations.declare,
    regex.operations.modulo,
    regex.operations.power,
    regex.operations.multiply,
    regex.operations.divide,
    regex.operations.add,
    regex.operations.subtract
];

const _ = (str, i) => {return order[i]}

module.exports = (str, ops) => {
    let s = str;
    let o = ops;
    while (regex.variables.user.test(s)) {
        const g = s.match(regex.variables.user);
        console.log(g);
        if (o.variables.has(g[1]))
            s = s.replace(g[0], ops.variables[g[1]]);
        else {
            for (let i in order) {
                const g = _(s, i);

                if (g != null) {
                    if (i == 1)
                        o.variables.set(g[1], g[2])
                    else if (o.variables.has(g[1])) {
                        switch (i) {
                            case 0: {
                                for (let i in g[1].length)
                                    o.variables.set(g[2], o.variables.get(g[2]) == 0 ? 1 : 0);
                                break;                                    
                            }
                            case 2: {
                                o.variables.get(g[1]) = o.variables.get(g[1]) % g[2];
                                break;
                            }
                            case 3: {
                                o.variables.get(g[1]) = Math.pow(o.variables.get(g[1]), g[2]);
                                break;
                            }
                            case 4: {
                                o.variables.get(g[1]) *= g[2];
                                break;
                            }
                            case 5: {
                                o.variables.get(g[1]) /= g[2];
                                break;
                            }
                            case 6: {
                                o.variables.get(g[1]) += g[2];
                                break;
                            }
                            case 7: {
                                o.variables.get(g[1]) += g[2];
                                break;
                            }
                        }
                    }
                }
            }
        }
    }

    return {
       value: s,
       vars: o.variables
    }
}