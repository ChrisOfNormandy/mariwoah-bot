// const { s3 } = require('../../helpers/aws');

function fetch(id, name) {
    return new Promise((resolve, reject) => {
        s3.object.get('mariwoah', `guilds/${id}/factions/${name}.json`)
            .then((response) => resolve(JSON.parse(response.Body.toString())))
            .catch((err) => reject(err));
    });
}

function remove(id, name) {
    return new Promise((resolve, reject) => {
        s3.object.delete('mariwoah', `guilds/${id}/factions/${name}.json`)
            .then((response) => resolve(response))
            .catch((err) => reject(err));
    });
}

module.exports = {
    fetch,
    remove
};