const mysql = require('mysql');
const query = require('./helpers/query');
const users = require('./helpers/users');
const server = require('./helpers/server');

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
    }
}