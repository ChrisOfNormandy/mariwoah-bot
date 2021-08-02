module.exports = {
    chatFilter_get: require('./features/chatFilter').get,
    chatFilter_add: require('./features/chatFilter').add,
    chatFilter_remove: require('./features/chatFilter').remove,
    chatFilter_clear: require('./features/chatFilter').clear,
    nameFilter_get: require('./features/nameFilter').get,
    nameFilter_add: require('./features/nameFilter').add,
    nameFilter_remove: require('./features/nameFilter').remove,
    nameFilter_clear: require('./features/nameFilter').clear,
    clean: require('./features/clean'),
    colorMe: require('./features/colorMe'),
    roll: require('./features/roll'),
    roleHandler: require('./features/roleHandler'),
    shuffle: require('./features/shuffle'),
    splitVc: require('./features/splitVc'),
    vcRoulette: require('./features/vcRoulette')
};