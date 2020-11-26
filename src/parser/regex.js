module.exports = {
    operations: {
        declare: /(\w+)\s?=\s?(\w+)/g,
        add: /(\w+)\s?\+=\s?(\w+)/g,
        subtract: /(\w+)\s?-=\s?(\w+)/g,
        multiply: /(\w+)\s?\*=\s?(\w+)/g,
        divide: /(\w+)\s?\/=\s?(\w+)/g,
        modulo: /(\w+)\s?%=\s?(\w+)/g,
        power: /(\w+)\s?\^=\s?(\w+)/g,
        negate: /(!+)(\w+)/g
    },
    conditions: {
        equates: /(\w+)\s?==\s?(\w+)/g,
        n_equates: /(\w+)\s?!=\s?(\w+)/g,
        greater: /(\w+)\s?>\s?(\w+)/g,
        greater_eq: /(\w+)\s?>=\s?(\w+)/g,
        lesser: /(\w+)\s?<\s?(\w+)/g,
        lesser_eq: /(\w+)\s?<=\s?(\w+)/g,
        and: /(\w+)\s?&&\s?(\w+)/g,
        or: /(\w+)\s?\|\|\s?(\w+)/g,
        nand: /(\w+)\s?!&\s?(\w+)/g,
        nor: /(\w+)\s?!\|\s?(\w+)/g,
        xand: /(\w+)\s?x&\s?(\w+)/g,
        xnor: /(\w+)\s?x!\|\s?(\w+)/g,
        xor: /(\w+)\s?x\|\s?(\w+)/g,
        xnand: /(\w+)\s?x!&\s?(\w+)/g,
        divisible: /(\w+)\s?\/%\s?(\w+)/g,
        n_divisible: /(\w+)\s?!\/%\s?(\w+)/g,
    },
    types: {
        number: /\d+(\.(\d+))?/g,
        string: /('(.*)')|("(.*)")/g,
        function: /\((\w+(,\s?)*)*\)\s?=>\s?{(.*)}/g,
        map: {
            array: /\[(\w+(,\s?)*)*\]/g,
            // hashmap: 
        }
    },
    functions: {
        then: /\.then\((\w(\s,\s\w)*\s=>\s.+)\)/g
    },
    special_operations: {

    },
    new_line: /\n/g   
}