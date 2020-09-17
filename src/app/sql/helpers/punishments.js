const connection = require('../connection');
const con = connection.con;
const users = require('./users');

function getUser(message, userID, type) {
    return new Promise((resolve, reject) =>  {
    users.getUser(message.guild.id, userID)
        .then(user => {
            con.query(`select * from PUNISHMENTS where server_id = "${message.guild.id}" and user_id = "${userID}" and type = "${type}";`, (err, result) => {
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

function setUser(message, userID, type, reason = null, duration = -1, severity = 'normal') {
    users.getUser(message.guild.id, userID)
        .then(user => {
            const date = new Date(message.createdTimestamp);
            const datetime = `${date.toISOString().slice(0, 19).replace('T', ' ')}`;

            if (reason == null)
                con.query(`insert into PUNISHMENTS (server_id, user_id, type, duration, severity, ticket_id, staff_id, username, datetime) values (` +
                    `"${message.guild.id}", 
                    "${userID}", 
                    "${type}", 
                    ${duration}, 
                    "${severity}", 
                    "${message.createdTimestamp}", 
                    "${message.author.id}", 
                    "${message.guild.members.cache.get(userID).user.username}", 
                    "${datetime}");`,
                    (err, result) => {
                        if (err)
                            console.log(err);
                });
            else
                con.query(`insert into PUNISHMENTS (server_id, user_id, type, duration, severity, ticket_id, staff_id, username, datetime, reason) values (` +
                    `"${message.guild.id}", 
                    "${userID}", 
                    "${type}", 
                    ${duration}, 
                    "${severity}", 
                    "${message.createdTimestamp}", 
                    "${message.author.id}", 
                    "${message.guild.members.cache.get(userID).user.username}", 
                    "${datetime}", 
                    "${reason}");`,
                    (err, result) => {
                        if (err)
                            console.log(err);
                });
        });
}

module.exports = {
    getUser,
    setUser
}