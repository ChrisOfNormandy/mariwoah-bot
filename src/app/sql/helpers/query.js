function getUser(con, serverID, userID) {
    return new Promise(function(resolve, reject) {
        con.query(`select * from USERS where server_id = "${serverID}" and user_id = "${userID}";`, (err, result) => {
            if (err)
                reject(err);
            else {
                if (result.length)
                    resolve(result[0]);
                else {
                    getServer(con, serverID)
                        .then(server => {
                            console.log(server);
                            con.query(`insert into USERS(server_id, user_id) values ("${serverID}", "${userID}");`);
                            resolve(getUser(con, serverID, userID));
                        })
                        .catch(e => console.log(e));
                }
            }
        });
    });    
}

function getServer(con, serverID) {
    return new Promise(function(resolve, reject) {
        con.query(`select * from SERVER where id = "${serverID}";`, (err, result) => {
            if (err)
                reject(err);
            else {
                if (result.length)
                    resolve(result[0]);
                else {
                    con.query(`insert into SERVER(id, motd, prefix) values ("${serverID}", "Message of the Day!", "~");`);
                    resolve(getServer(con, serverID));
                }
            }
        });
    });
}

module.exports = {
    getUser,
    getServer
}