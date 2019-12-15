const fs = require('fs');

module.exports = function(path) {
    return new Promise(function(resolve, reject) {
        fs.readdir(path, (err, data) => {
            if (err) {
                console.log(err);
                reject(null);
                return;
            }
            let list = [];
            for (i in data) list.push(data[i]);
            console.log('Directory list:');
            console.log(list);
            resolve(list);
        });
    });
}