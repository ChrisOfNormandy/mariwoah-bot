const connection = require('../connection');
const con = connection.con;
const servers = require('./servers');

function setMotd(serverID, string) {
    if (string.length > 255)
        return;
        
    servers.get(serverID)
        .then(server => {
            con.query(`update server set motd = "${string}" where id = "${serverID}";`, (err, result) => {
                if (err)
                    console.log(err);
                else
                    con.query(`select * from server where id = "${serverID}";`, (err, result) => {});
            });
        })
}

function setPrefix(serverID, prefix) {
    servers.get(serverID)
        .then(server => {
            con.query(`update server set prefix = "${prefix[0]}" where id = "${serverID}";`, (err, result) => {
                if (err)
                    console.log(err);
                else
                    con.query(`select * from server where id = "${serverID}";`, (err, result) => {});
            });
        })
}

function getMotd(serverID) {
    return new Promise((resolve, reject) => {
        servers.get(serverID)
            .then(server => {
                resolve(server.motd);
            })
            .catch(e => reject(e));
    });
}

function getPrefix(serverID) {
    return new Promise((resolve, reject) => {
        servers.get(serverID)
            .then(server => {
                resolve(server.prefix);
            })
            .catch(e => reject(e));
    });
}

module.exports = {
    setMotd,
    setPrefix,
    getMotd,
    getPrefix
}