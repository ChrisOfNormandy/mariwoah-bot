module.exports = function(array) {
    let msg = '';
    for (i in array) msg += array[i].text + '\n';
    return msg;
}