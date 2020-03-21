const query = require('./query');

function getUser(con, message, userID, type) {
    return new Promise(function (resolve, reject) {
    query.getUser(con, message.guild.id, userID)
        .then(user => {
            con.query(`select * from punishments where server_id = "${message.guild.id}" and user_id = "${userID}" and type = "${type}";`, (err, result) => {
                if (err)
                    reject(err);
                else
                    if (!result.length)
                        reject(null);
                    else
                        resolve(result)
            })
        })
        .catch(e => reject(e));
    });
}

function setUser(con, message, userID, type, reason = null) {
    query.getUser(con, message.guild.id, userID)
        .then(user => {
            const date = new Date(message.createdTimestamp);
            const datetime = `${date.toISOString().slice(0, 19).replace('T', ' ')}`;
            console.log(datetime);
            if (reason == null)
                con.query(`insert into punishments (datetime, server_id, staff_id, ticket_id, type, user_id, username) values (` +
                    `"${datetime}", 
                    "${message.guild.id}", 
                    "${message.author.id}", 
                    ${message.createdTimestamp}, 
                    "${type}", 
                    "${userID}", 
                    "${message.guild.members.get(userID).user.username}");`,
                    (err, result) => {
                        if (err)
                            console.log(err);
                        else
                            console.log(result);
                    });
            else
                con.query(`insert into punishments (datetime, server_id, staff_id, ticket_id, type, user_id, username, reason) values (` +
                    `"${datetime}", 
                    "${message.guild.id}", 
                    "${message.author.id}", 
                    ${message.createdTimestamp}, 
                    "${type}", 
                    "${userID}", 
                    "${message.guild.members.get(userID).user.username}", 
                    "${reason}");`,
                    (err, result) => {
                        if (err)
                            console.log(err);
                        else
                            console.log(result);
                    });
        });
}

module.exports = {
    getUser,
    setUser
}