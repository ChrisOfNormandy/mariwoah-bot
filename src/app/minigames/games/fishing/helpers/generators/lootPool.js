const itemlist = require('../../../../helpers/items/itemlist');

const fishlist = itemlist.fish;
const lootlist = itemlist.fishloot;

module.exports = {
    pool: {
        fish: {},
        items: {}
    },

    generate: function () {
        for (tier in fishlist) {
            this.pool.fish[tier] = [];
            for (item in fishlist[tier])
                this.pool.fish[tier].push(item);
        }
        for (tier in lootlist) {
            this.pool.items[tier] = [];
            for (item in lootlist[tier])
                this.pool.items[tier].push(item);
        }
    }
}