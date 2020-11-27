module.exports = {
    operations: {
        declare: /(\w+)\s?=\s?(\w+)/,
        add: /(-?\d+(\.\d+)?)\s?\+=\s?(-?\d+(\.\d+)?)/,
        subtract: /(-?\d+(\.\d+)?)\s?-=\s?(-?\d+(\.\d+)?)/,
        multiply: /(-?\d+(\.\d+)?)\s?\*=\s?(-?\d+(\.\d+)?)/,
        divide: /(-?\d+(\.\d+)?)\s?\/=\s?(-?\d+(\.\d+)?)/,
        modulo: /(-?\d+(\.\d+)?)\s?%=\s?(-?\d+(\.\d+)?)/,
        power: /(-?\d+(\.\d+)?)\s?\^=\s?(-?\d+(\.\d+)?)/,
        negate: /(!+)(\w+)/,
        math: {
            parentheses: /\((.*)\)/,
            addition: /(-?\d+(\.\d+)?)\s?\+\s?(-?\d+(\.\d+)?)/,
            subtraction: /(-?\d+(\.\d+)?)\s?-\s?(-?\d+(\.\d+)?)/,
            multiplication: /(-?\d+(\.\d+)?)\s?\*\s?(-?\d+(\.\d+)?)/,
            division: /(-?\d+(\.\d+)?)\s?\/\s?(-?\d+(\.\d+)?)/,
            modulo: /(-?\d+(\.\d+)?)\s?%\s?(-?\d+(\.\d+)?)/,
            factorial: /(-?\d+(\.\d+)?)!/,
            power: /(-?\d+(\.\d+)?)\^(-?\d+(\.\d+)?)/
        }
    },
    conditions: {
        equates: /([\w\s.]+)\s?==\s?([\w\s.]+)/,
        n_equates: /([\w\s.]+)\s?!=\s?([\w\s.]+)/,
        greater: /(-?\d+(\.\d+)?)\s?>\s?(-?\d+(\.\d+)?)/,
        greater_eq: /(-?\d+(\.\d+)?)\s?>=\s?(-?\d+(\.\d+)?)/,
        lesser: /(-?\d+(\.\d+)?)\s?<\s?(-?\d+(\.\d+)?)/,
        lesser_eq: /(-?\d+(\.\d+)?)\s?<=\s?(-?\d+(\.\d+)?)/,
        and: /(0|1)\s?&&\s?(0|1)/,
        or: /(0|1)\s?\|\|\s?(0|1)/,
        nand: /(0|1)\s?!&\s?(0|1)/,
        nor: /(0|1)\s?!\|\s?(0|1)/,
        xand: /(0|1)\s?x&\s?(0|1)/,
        xnor: /(0|1)\s?x!\|\s?(0|1)/,
        xor: /(0|1)\s?x\|\s?(0|1)/,
        xnand: /(0|1)\s?x!&\s?(0|1)/,
        divisible: /(-?\d+(\.\d+)?)\s?\/%\s?(-?\d+(\.\d+)?)/,
        n_divisible: /(-?\d+(\.\d+)?)\s?!\/%\s?(-?\d+(\.\d+)?)/,
    },
    types: {
        number: /\d+(\.(\d+))?/,
        string: /('(.*)')|("(.*)")/,
        function: /\((\w+(,\s?)*)*\)\s?=>\s?{(.*)}/,
        map: {
            array: /\[(\w+(,\s?)*)*\]/,
            // hashmap: 
        }
    },
    functions: {
        _: /:(\w+)(\.(\w+))?\((.*)\)/
    },
    variables: {
        _: /:(\w+)(\.(\w+))?/
    },
    special_operations: {
        _: /\$(\w+)/
    },
    new_line: /\n/,
    csv: /(?<!["']\w*),\s*(?!\w*["'])/,
    parentheses: /\((.*)\)/
}