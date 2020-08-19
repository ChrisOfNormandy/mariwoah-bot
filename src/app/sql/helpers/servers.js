const general = require('./servers/general');
const guilds = require('./servers/guilds');
const roles = require('./servers/roles');
const timeout = require('./servers/timeout');

module.exports = {
    get: general.get,
    general,
    guilds,
    roles,
    timeout
}