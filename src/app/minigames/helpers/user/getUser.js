const createUser = require('./createUser');
const pushStats = require('./pushStats');
const statsMap = require('./statsMap');

module.exports = function (message) {
    if (statsMap.map.has(message.author.id)) {
        return statsMap.map.get(message.author.id);
    }
    else {
        let user = createUser(message);
        statsMap.map.set(user.definition.id, user);
        pushStats()
            .then(r => console.log(`Pushed stats resolved ${r}`))
            .catch(e => console.log(e));
        return statsMap.map.get(user.definition.id);
    }
}