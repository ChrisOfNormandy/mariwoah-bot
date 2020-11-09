const commandFormat = require('../../common/bot/helpers/global/commandFormat');
const setRoles = require('./setRoles');

function add(message, data) {
    console.log('Adding roles.')
    return new Promise((resolve, reject) => {
        let promises = [];
        data.mentions.members.forEach((user, userID, map) => {
            data.mentions.roles.forEach((role, roleID, map) => {
                promises.push(setRoles.add(message, userID, roleID));
            });
        });

        Promise.all(promises)
            .then(results => {
                resolve(commandFormat.valid(results, [`Updated roles for ${data.mentions.members.size} members`]))
            })
            .catch(err => reject(commandFormat.error([err], ['Failed to update roles.'])));
    });
}

function remove(message, data) {
    console.log('Removing roles.')
    return new Promise((resolve, reject) => {
        let promises = [];
        data.mentions.members.forEach((user, userID, map) => {
            data.mentions.roles.forEach((role, roleID, map) => {
                promises.push(setRoles.remove(message, userID, roleID));
            });
        });

        Promise.all(promises)
            .then(results => {
                resolve(commandFormat.valid(results, [`Updated roles for ${data.mentions.members.size} members`]))
            })
            .catch(err => reject(commandFormat.error([err], ['Failed to update roles.'])));
    });
}

module.exports = {
    add,
    remove
}