module.exports = {
    setPermission: require('./helpers/setPermission'),
    setRank: require('./helpers/setRank'),
    verifyPermission: require('./helpers/verifyPermission'),
    setRoles: require('./helpers/setRoles'),
    guilds: require('./guilds/adapter'),
    setRoles_server: require('./helpers/setRoles_server'),
    reactRole: require('./helpers/reactRole')
}