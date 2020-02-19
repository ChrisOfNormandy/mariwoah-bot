module.exports = async function (array) {
    return new Promise(function (resolve, reject) {
        if (!array.length)
            reject(array);

        let j;
        for (let i = array.length - 1; i > 0; i--) {
            j = Math.floor(Math.random() * (i + 1));
            [array[i], array[j]] = [array[j], array[i]];
        }

        resolve(array);
    })
}