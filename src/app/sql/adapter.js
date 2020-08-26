const users = require('./helpers/users');
const server = require('./helpers/servers');
const punishments = require('./helpers/punishments');
const playlists = require('./helpers/playlists');
const minigames = require('./helpers/minigames');

module.exports = {
    server,
    user: {
        get: (serverID, userID) => {return users.get(serverID, userID)},
        setBotRole: (serverID, userID, roleName) => {return users.setBotRole(serverID, userID, roleName)},
        setPermissionLevel: (serverID, userID, level) => {return users.setPermissionLevel(serverID, userID, level)},
        getBotRole: (serverID, userID) => {return users.getBotRole(serverID, userID)},
        getPermissionLevel: (serverID, userID) => {return users.getPermissionLevel(serverID, userID)}
    },
    punishments: {
        getUser: (message, userID, type) => {return punishments.getUser(message, userID, type)},
        setUser: (message, userID, type, reason = null, duration = -1, severity = 'normal') => {return punishments.setUser(message, userID, type, reason, duration, severity)}
    },
    playlists: {
        create: (message, name) => {return playlists.create(message, name)},
        get: (message, name) => {return playlists.get(message, name)},
        append: (message, name, song) => {return playlists.append(message, name, song)},
        getList: (message, name) => {return playlists.getList(message, name)},
        getAll: (message) => {return playlists.getAll(message)},
        delete: (message, name) => {return playlists.remove(message, name)},
        remove: (message, name, songURL) => {return playlists.removeSong(message, name, songURL)}
    },
    minigames: {
        getStats: (message, userID) => {return minigames.getStats(message, userID)},
        pay: (message, userID, amount) => {return minigames.pay(message, userID, amount)},
        exp: (message, userID, amount) => {return minigames.exp(message, userID, amount)},
        getItemList: () => {return minigames.getItemList(con)},
        getFishList: (rarity = 0) => {return minigames.getFishList(rarity)},
        inventory: {
            get: (message, data) => {return minigames.inventory.get(message, data)},
            set: (message, json) => {return minigames.inventory.set(message, json)},
            give: (message, item, amount = 1) => {return minigames.inventory.give(message, item, amount)},
            find: (message, data) => {return minigames.inventory.find(message, data)}
        },
        fishing: {
            get: (message, userID) => {return minigames.fishing.get(message, userID)},
            catchFish: (message, userID, amount = 1) => {return minigames.fishing.catchFish(message, userID, amount)},
            catchNone: (message, userID, amount = 1) => {return minigames.fishing.catchNone(message, userID, amount)},
            catchTrash: (message, userID, amount = 1) => {return minigames.fishing.catchTrash(message, userID, amount)},
            catchItem: (message, userID, amount = 1) => {return minigames.fishing.catchItem(message, userID, amount)},
            exp: (message, userID, amount) => {return minigames.fishing.exp(message, userID, amount)}
        },

        updateCondition: (name, meta, value) => {minigames.updateCondition(name, meta, value)}
    },
}