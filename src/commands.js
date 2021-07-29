module.exports = {
    factions: require('./app/groups/factions/commands'),
    fetch: require('./app/groups/fetch/commands'),
    games: require('./app/groups/games/commands'),
    general: require('./app/groups/general/commands'),
    crypto: require('./app/groups/misc/commands').crypto,
    music: require('./app/groups/music/commands'),
    utility: require('./app/groups/utility/commands')
};