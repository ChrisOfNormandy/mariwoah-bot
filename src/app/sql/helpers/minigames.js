const query = require('./query');

function getStats(con, message, userID) {
    return new Promise((resolve, reject) =>  {
        con.query(`select * from stats where server_id = "${message.guild.id}" and user_id = "${userID}";`, (err, result) => {
            if (err)
                reject(err);
            else {
                if (!result.length)
                    con.query(`insert into stats (server_id, user_id) values ("${message.guild.id}", "${userID}");`, (err, result) => {
                        if (err)
                            reject(null);
                        else
                            resolve(getStats(con, message, userID));
                    })
                else
                    resolve(result[0]);
            }
        });
    });
}

function getFishing(con, message, userID) {
    return new Promise((resolve, reject) =>  {
        getStats(con, message, userID)
            .then(user => {
                con.query(`select * from minigames_fishing where server_id = "${message.guild.id}" and user_id = "${userID}";`, (err, result) => {
                    if (err)
                        reject(err);
                    else {
                        if (!result.length)
                            con.query(`insert into minigames_fishing (server_id, user_id) values ("${message.guild.id}", "${userID}");`, (err, result) => {
                                if (err)
                                    reject(null);
                                else
                                    resolve(getFishing(con, message, userID));
                            })
                        else
                            resolve(result[0]);
                    }
                });
            })
            .catch(e => reject(e));
    });
}

function pay(con, message, userID, amount) {
    getStats(con, message, userID)
        .then(user => {
            con.query(`update stats set balance = '${(user.balance + amount).toFixed(2)}' where server_id = "${message.guild.id}" and user_id = "${userID}";`, (err, result) => {
                if (err)
                    console.log(err);
            });
        })
        .catch(e => console.log(e));
}

function getItemList(con) {
    return new Promise((resolve, reject) => {
        con.query(`select * from itemlist where type = 'item';`, (err, result) => {
            if (err)
                reject(err);
            else
                resolve(result);
        });
    });
}

function getFishList(con, rarity = null) {
    return new Promise((resolve, reject) => {
        let str = `select * from itemlist where type = 'item' and subtype = 'raw_fish'`
        if (rarity !== null)
            str += ` and rarity = '${rarity}'`
        str += ';';

        con.query(str, (err, result) => {
            if (err)
                reject(err);
            else
                resolve(result);
        });
    });
}



function updateCondition(con, name, meta, value) {
    con.query(`update itemlist set conditions = '${JSON.stringify(value)}' where name = '${name}' and meta = '${meta}';`, (err, result) => {
        if (err)
            console.log(err);
    })
}

module.exports = {
    getStats,
    pay,
    getItemList,
    getFishList,
    fishing: {
        get: (con, message, userID) => {return getFishing(con, message, userID)}
    },

    updateCondition
}