module.exports = (array) => {
    if (!array.length)
        return Promise.reject(array);

    return new Promise((resolve, reject) => {
        let j;
        for (let i = array.length - 1; i > 0; i--) {
            j = Math.floor(Math.random() * (i + 1));
            [array[i], array[j]] = [array[j], array[i]];
        }

        resolve(array);
    });
};