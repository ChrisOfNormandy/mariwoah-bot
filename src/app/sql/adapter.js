const mysql = require('mysql');
const users = require('./helpers/users');
const server = require('./helpers/servers');
const punishments = require('./helpers/punishments');
const playlists = require('./helpers/playlists');
const minigames = require('./helpers/minigames');
const config = require('../../../private/config');

const db_config = {
    host: "localhost",
    user: config.sql.username,
    password: config.sql.password,
    database: config.sql.database
};

var con;

function onDisconnect() {
    con = mysql.createConnection(db_config);

    con.connect((err) => {
        if (err) {
            console.log('Error connecting to database. Retrying in 10 seconds.');
            console.log(err);
            setTimeout(onDisconnect(), 10000);
        }
        else
            console.log('Connected to the SQL server.');
    });

    con.on('error', (err) => {
        console.log('Database error;', err);
        if (err.code === 'PROTOCOL_CONNECTION_LOST')
            onDisconnect();
        else {
            console.log('Disconnect was not connection lost error; retrying in 30 seconds.');
            onDisconnect();
        }
    });
}

function startup() {
    onDisconnect();
}

module.exports = {
    con,
    startup,
    server: {
        get: (serverID) => {return server.getServer(con, serverID)},
        setMotd: (serverID, string) => {server.setMotd(con, serverID, string)},
        setPrefix: (serverID, prefix) => {server.setPrefix(con, serverID, prefix)},
        setRole: (serverID, role, id) => {return server.setRole(con, serverID, role, id)},
        getMotd: (serverID) => {return server.getMotd(con, serverID)},
        getPrefix: (serverID) => {return server.getPrefix(con, serverID)},
        getRoles: (serverID) => {return server.getRoles(con, serverID)}
    },
    user: {
        get: (serverID, userID) => {return users.getUser(con, serverID, userID)},
        setBotRole: (serverID, userID, roleName) => {return users.setBotRole(con, serverID, userID, roleName)},
        setPermissionLevel: (serverID, userID, level) => {return users.setPermissionLevel(con, serverID, userID, level)},
        getBotRole: (serverID, userID) => {return users.getBotRole(con, serverID, userID)},
        getPermissionLevel: (serverID, userID) => {return users.getPermissionLevel(con, serverID, userID)}
    },
    punishments: {
        getUser: (message, userID, type) => {return punishments.getUser(con, message, userID, type)},
        setUser: (message, userID, type, reason = null, duration = -1, severity = 'normal') => {punishments.setUser(con, message, userID, type, reason, duration, severity)}
    },
    playlists: {
        create: (message, name) => {return playlists.create(con, message, name)},
        get: (message, name) => {return playlists.get(con, message, name)},
        append: (message, name, song) => {playlists.append(con, message, name, song)},
        getList: (message, name) => {return playlists.getList(con, message, name)},
        getAll: (message) => {return playlists.getAll(con, message)},
        delete: (message, name) => {return playlists.remove(con, message, name)},
        remove: (message, name, songURL) => {return playlists.removeSong(con, message, name, songURL)}
    },
    minigames: {
        getStats: (message, userID) => {return minigames.getStats(con, message, userID)},
        pay: (message, userID, amount) => {minigames.pay(con, message, userID, amount)},
        getItemList: () => {return minigames.getItemList(con)},
        getFishList: (rarity = null) => {return minigames.getFishList(con, rarity)},
        fishing: {
            get: (message, userID) => {return minigames.fishing.get(con, message, userID)}
        },

        updateCondition: (name, meta, value) => {minigames.updateCondition(con, name, meta, value)}
    }
}