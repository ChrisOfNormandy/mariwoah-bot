const query = require('./query');

function setMotd(con, serverID, string) {
    console.log(string);
    if (string.length > 255)
        return;
    query.getServer(con, serverID)
        .then(server => {
            con.query(`update servers set motd = "${string}" where id = "${serverID}";`, (err, result) => {
                if (err)
                    console.log(err);
                else
                    con.query(`select * from server where id = "${serverID}";`, (err, result) => {
                        console.log(result);
                    });
            });
        })
}

function setPrefix(con, serverID, prefix) {
    query.getServer(con, serverID)
        .then(server => {
            con.query(`update servers set prefix = "${prefix[0]}" where id = "${serverID}";`, (err, result) => {
                if (err)
                    console.log(err);
                else
                    con.query(`select * from server where id = "${serverID}";`, (err, result) => {
                        console.log(result);
                    });
            });
        })
}

function getMotd(con, serverID) {
    return new Promise((resolve, reject) =>  {
        query.getServer(con, serverID)
            .then(server => {
                resolve(server.motd);
            })
            .catch(e => reject(e));
    });
}

function getPrefix(con, serverID) {
    return new Promise((resolve, reject) =>  {
        query.getServer(con, serverID)
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