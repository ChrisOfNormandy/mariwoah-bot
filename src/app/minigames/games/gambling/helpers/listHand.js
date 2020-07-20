module.exports = function (array) {
    let msg = '';
    for (let i in array)
        msg += array[i].text + '\n';
    return msg;
}