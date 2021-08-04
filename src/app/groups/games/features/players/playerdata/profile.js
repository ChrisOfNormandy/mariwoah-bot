const { s3 } = require('../../../../../helpers/aws');
const getFile = require('./get');

const cache = new Map();
const writeCache = new Map();

let saveLoop;

function create(userID) {
    const profile = {
        id: userID,
        skills: {
            fishing: {
                score: 0
            }
        },
        stats: {
            fishing: {
                catches: {
                    fish: {},
                    treasure: {},
                    trash: {},
                    total: {
                        fish: 0,
                        treasure: 0,
                        trash: 0,
                        all: 0
                    }
                },
                misses: 0
            }
        }
    };

    return profile;
}

function vs(a, b) {
    if (a === undefined)
        return b;

    if (b === undefined)
        return a;

    if (typeof a === 'object') {
        for (let i in a)
            a[i] = vs(a[i], b[i]);
        for (let i in b)
            a[i] = vs(a[i], b[i]);

        return a;
    }

    return b;
}

function update(userID, user) {
    return set(userID, vs(create(userID), user));
}

function write(userID) {
    return new Promise((resolve, reject) => {
        get(userID)
            .then(user => {
                s3.object.putData('mariwoah', 'user-data/players', `${userID}.json`, JSON.stringify(user))
                    .then(result => resolve(result))
                    .catch(err => reject(err));
            })
            .catch(err => reject(err));
    });
}

function newFile(userID) {
    set(userID, create(userID));
    return write(userID);
}

function save() {
    if (!writeCache.size) {
        console.log('Nothing to save. Stopping save loop.');
        saveLoop = null;
        return;
    }

    let arr = [];
    writeCache.forEach((v, k, m) => arr.push(write(k)));

    Promise.all(arr)
        .then(results => {
            console.log(`Saved ${results.length} profiles.`);

            cache.forEach((v, k, m) => {
                if (!writeCache.has(k))
                    cache.delete(k);
            });

            writeCache.clear();

            saveLoop = setTimeout(() => {
                console.log('Setting save timeout to 5 minutes.');
                save();
            }, 300000);
        })
        .catch(err => console.error(err));
}

function set(userID, profile) {
    cache.set(userID, profile);

    if (!writeCache.size && saveLoop === null) {
        saveLoop = setTimeout(() => {
            console.log('Setting save timeout to 5 minutes.');
            save();
        }, 300000);
    }

    writeCache.set(userID, true);

    return profile;
}

function get(userID) {
    return new Promise((resolve, reject) => {
        if (!cache.has(userID)) {
            getFile(userID)
                .then(data => resolve(set(userID, update(userID, data))))
                .catch(() => resolve(set(userID, create(userID))));
        }
        else
            resolve(cache.get(userID));
    });
}

module.exports = {
    cache,
    newFile,
    save,
    write,
    update,
    get,
    set
};