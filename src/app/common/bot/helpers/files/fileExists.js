const fs = require('fs');

module.exports =  function (path) {
    return new Promise(function (resolve, reject) {
        fs.access(path, fs.F_OK, (err) => {
            if (err)
                reject(false); // Does not exist
            else
                resolve(true); // Does exist
        });
    });
}