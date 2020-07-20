const setPermission = require('./helpers/setPermission');
const setRank = require('./helpers/setRank');
const verifyPermission = require('./helpers/verifyPermission');
const getRoles = require('./helpers/getRoles');
const setRoles = require('./helpers/setRoles');
const guilds = require('./guilds/adapter');

module.exports = {
    setPermission,
    setRank,
    verifyPermission,
    getRoles,
    setRoles,
    guilds
}