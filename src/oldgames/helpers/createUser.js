module.exports = function (message) {
    return {
        user: {
            id: message.author.id,
            name: message.author.username
        },
        stats: {
            money: 0,
            experience: 0
        },
        inventories: {
            items: [],
            fishing: [],
            mining: []
        },
        fishing: {
            level: 0,
            rod: {
                durability: 20,
                catches: 0,
                inUse: false
            }
        },
        gathering: {
            level: 0
        },
        mining: {
            level: 0,
            timer: 0,
            result: null,
            pick: {
                durability: 20,
                veins: 0,
                inUse: false
            }
        }
    };
}