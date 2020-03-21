const mysql = require('mysql');
const query = require('./helpers/query');
const users = require('./helpers/users');
const server = require('./helpers/server');
const punishments = require('./helpers/punishments');
const playlists = require('./helpers/playlists');

const con = mysql.createConnection({
    server: "localhost",
    user: "chris",
    password: "Pswrd123#!",
    database: "discordbot"
});

function startup() {
    con.connect(function (err) {
        if (err)
            console.log(err);
        else
            console.log("Connected!");
    });
}

module.exports = {
    con,
    startup,
    server: {
        get: (serverID) => {return query.getServer(con, serverID)},
        setMotd: (serverID, string) => {server.setMotd(con, serverID, string)},
        setPrefix: (serverID, prefix) => {server.setPrefix(con, serverID, prefix)},
        getMotd: (serverID) => {return server.getMotd(con, serverID)},
        getPrefix: (serverID) => {return server.getPrefix(con, serverID)}
    },
    user: {
        get: (serverID, userID) => {return query.getUser(con, serverID, userID)},
        setBotRole: (serverID, userID, roleName) => {users.setBotRole(con, serverID, userID, roleName)},
        setPermissionLevel: (serverID, userID, level) => {users.setPermissionLevel(con, serverID, userID, level)},
        getBotRole: (serverID, userID) => {return users.getBotRole(con, serverID, userID)},
        getPermissionLevel: (serverID, userID) => {return users.getPermissionLevel(con, serverID, userID)}
    },
    punishments: {
        getUser: (message, userID, type) => {return punishments.getUser(con, message, userID, type)},
        setUser: (message, userID, type, reason = null) => {punishments.setUser(con, message, userID, type, reason)}
    },
    playlists: {
        create: (message, name) => {return playlists.create(con, message, name)},
        get: (message, name) => {return playlists.get(con, message, name)},
        append: (message, name, song) => {playlists.append(con, message, name, song)},
        getList: (message, name) => {return playlists.getList(con, message, name)},
        getAll: (message) => {return playlists.getAll(con, message)},
        delete: (message, name) => {return playlists.remove(con, message, name)},
        remove: (message, name, songURL) => {return playlists.removeSong(con, message, name, songURL)}
    }
}