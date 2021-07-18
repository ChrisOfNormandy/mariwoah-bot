module.exports = {
    inventory: {
        list: require('./features/inventory/list')
    },
    fishing: {
        loot_table: require('./features/fishing/loot_table.json'),
        cast: require('./features/fishing/cast')
    }
};