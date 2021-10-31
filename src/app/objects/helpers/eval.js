const funcRegex = /:(\w+)\((.+)\)/;
const groupRegex = /\((.+)\)/;

function evalGroup(input) {
    if (groupRegex.test(input)) {
        const s = input.match(groupRegex);
        console.log(s);
        return evalGroup(s[1]);
    }

    return input;
}

/**
 * 
 * @param {string} input 
 * @returns 
 */
module.exports = (input) => {
    console.log('Eval', input);

    const d = input.match(funcRegex);
    
    if (d === null)
        return input;

    console.log(d);
    
    const s = evalGroup(d[2]);

    console.log(s);

    return input;
};