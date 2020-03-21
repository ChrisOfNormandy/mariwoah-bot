module.exports = async function (array, size) {
    return new Promise((resolve, reject) =>  {
        if (!array.length)
            reject(array);
        if (array.length <= size)
            resolve([array]);

        let arraySize = Math.ceil(array.length / size);
        let toReturn = new Array(arraySize);

        for (let i = 0; i < arraySize; i++) {
            if (i < arraySize - 1)
                toReturn[i] = new Array(size);
            else
                toReturn[i] = new Array(array.length % size);
            for (let k = size * i; k < size * (i + 1); k++) {
                if (array[k])
                    toReturn[i][k - size * i] = array[k];
            }
        }
        resolve(toReturn);
    });
}