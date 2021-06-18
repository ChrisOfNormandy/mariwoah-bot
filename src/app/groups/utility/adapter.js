module.exports = {
    chatFilter_get: require('./features/chatFilter').get,
    chatFilter_add: require('./features/chatFilter').add,
    chatFilter_remove: require('./features/chatFilter').remove,
    chatFilter_clear: require('./features/chatFilter').clear,
    clean: require('./features/clean'),
    colorMe: require('./features/colorMe'),
    roll: require('./features/roll'),
    shuffle: require('./features/shuffle')
}