const fs = require('fs');

module.exports = function (path) {
    return new Promise(function (resolve, reject) {
        fs.readdir(path, (err, data) => {
            if (err)
                reject(err);
            let list = [];
            for (let i in data)
                list.push(data[i]);
            resolve(list);
        });
    });
}