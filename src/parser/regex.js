module.exports = {
    operations: {
        declare: /(\w+)\s?=\s?(\w+)/,
        add: /(\w+)\s?\+=\s?(\w+)/,
        subtract: /(\w+)\s?-=\s?(\w+)/,
        multiply: /(\w+)\s?\*=\s?(\w+)/,
        divide: /(\w+)\s?\/=\s?(\w+)/,
        modulo: /(\w+)\s?%=\s?(\w+)/,
        power: /(\w+)\s?\^=\s?(\w+)/,
        negate: /(!+)(\w+)/,
        math: {
            parentheses: /\((.*)\)/,
            addition: /(-?\w+(\.\w+)?)\s?\+\s?(-?\w+(\.\w+)?)/,
            subtraction: /(-?\w+(\.\w+)?)\s?-\s?(-?\w+(\.\w+)?)/,
            multiplication: /(-?\w+(\.\w+)?)\s?\*\s?(-?\w+(\.\w+)?)/,
            division: /(-?\w+(\.\w+)?)\s?\/\s?(-?\w+(\.\w+)?)/,
            modulo: /(-?\w+(\.\w+)?)\s?%\s?(-?\w+(\.\w+)?)/,
            factorial: /(-?\w+(\.\w+)?)!/,
            power: /(-?\w+(\.\w+)?)\^(-?\w+(\.\w+)?)/
        }
    },
    conditions: {
        equates: /(\w+)\s?==\s?(\w+)/,
        n_equates: /(\w+)\s?!=\s?(\w+)/,
        greater: /(\w+)\s?>\s?(\w+)/,
        greater_eq: /(\w+)\s?>=\s?(\w+)/,
        lesser: /(\w+)\s?<\s?(\w+)/,
        lesser_eq: /(\w+)\s?<=\s?(\w+)/,
        and: /(\w+)\s?&&\s?(\w+)/,
        or: /(\w+)\s?\|\|\s?(\w+)/,
        nand: /(\w+)\s?!&\s?(\w+)/,
        nor: /(\w+)\s?!\|\s?(\w+)/,
        xand: /(\w+)\s?x&\s?(\w+)/,
        xnor: /(\w+)\s?x!\|\s?(\w+)/,
        xor: /(\w+)\s?x\|\s?(\w+)/,
        xnand: /(\w+)\s?x!&\s?(\w+)/,
        divisible: /(\w+)\s?\/%\s?(\w+)/,
        n_divisible: /(\w+)\s?!\/%\s?(\w+)/,
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
        _: /:(\w+)(\.(\w+))?\((.*)\)/,
        then: /\.then\((\w(\s,\s\w)*\s=>\s.+)\)/,
        math: /:math(\.(\w+))?\((.+)\)/,
        math_: /:math(\.(\w+))?\(([\w\s+\-*/%\^!]+)\)/
    },
    special_operations: {

    },
    new_line: /\n/
}