const fs = require('fs');

module.exports =  function (path) {
    return new Promise(function (resolve, reject) {
        fs.access(path, fs.F_OK, (err) => {
            if (err)
                reject(err);
            else
                resolve(true);
        });
    });
}