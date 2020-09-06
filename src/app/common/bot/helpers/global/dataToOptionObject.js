module.exports = function(data, options) {
    // console.log(data, options);
    let obj = {};
    
    obj['verbosse'] = (data.flags['v'] || options.verbose);

    return obj;
}