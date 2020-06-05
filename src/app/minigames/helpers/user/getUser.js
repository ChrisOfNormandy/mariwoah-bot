const createUser = require('./createUser');
const pushStats = require('./pushStats');
const statsMap = require('./statsMap');

module.exports = function (message) {
    return new Promise((resolve, reject) =>  {
        if (statsMap.map.has(message.author.id))
            resolve(statsMap.map.get(message.author.id));
        else {
            createUser(message)
                .then(user => {
                    statsMap.map.set(user.definition.id, user);
                    pushStats()
                        .then(r => resolve(statsMap.map.get(user.definition.id)))
                        .catch(e => reject(e));

                })
                .catch(e => reject(e));
        }
    });

}