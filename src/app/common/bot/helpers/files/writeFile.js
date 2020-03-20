const fs = require('fs');

module.exports = function(path, object) {
    return new Promise(function(resolve, reject) {
        fs.writeFile(path, JSON.stringify(object), (err) => {
            if (err)
                reject(err);
            else
                resolve(true);
        })
    })
}