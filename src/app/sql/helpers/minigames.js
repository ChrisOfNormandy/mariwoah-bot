function query(con, str) {
    return new Promise((resolve, reject) => {
        con.query(str, (err, result) => {
            if (err)
                reject(err);
            else
                resolve(result);
        });
    });
}

function getStats(con, message, userID) {
    return new Promise((resolve, reject) => {
        con.query(`select * from STATS where server_id = "${message.guild.id}" and user_id = "${userID}";`, (err, result) => {
            if (err)
                reject(err);
            else {
                if (!result.length)
                    con.query(`insert into STATS (server_id, user_id) values ("${message.guild.id}", "${userID}");`, (err, result) => {
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

function getStats_fishing(con, message, userID) {
    return new Promise((resolve, reject) => {
        getStats(con, message, userID)
            .then(user => {
                con.query(`select * from STATS_FISHING where server_id = "${message.guild.id}" and user_id = "${userID}";`, (err, result) => {
                    if (err)
                        reject(err);
                    else {
                        if (!result.length)
                            con.query(`insert into STATS_FISHING (server_id, user_id) values ("${message.guild.id}", "${userID}");`, (err, result) => {
                                if (err)
                                    reject(null);
                                else
                                    resolve(getStats_fishing(con, message, userID));
                            });
                        else
                            resolve(result[0]);
                    }
                });
            })
            .catch(e => reject(e));
    });
}

// STATS (regular)

function levelUp(level, exp, change = false) {
    let val = Math.round(((150 * (level + 30)) / (Math.pow(50, 1.1) - level)) - 41);
    let obj = { level, exp, val, change }

    if (exp >= val) {
        obj = levelUp(level + 1, exp - val, true);
    }
    return obj;
}

function pay(con, message, userID, amount) {
    return new Promise((resolve, reject) => {
        getStats(con, message, userID)
            .then(user => {
                query(con, `update STATS set balance = '${(user.balance + amount).toFixed(2)}' where server_id = "${message.guild.id}" and user_id = "${userID}";`)
                    .then(r => resolve(r))
                    .catch(e => reject(e));
            })
            .catch(e => reject(e));
    });
}

function exp(con, message, userID, amount) {
    return new Promise((resolve, reject) => {
        getStats(con, message, userID)
            .then(user => {
                let val = levelUp(user.level, user.experience + amount);
                query(con, `update STATS set level = ${val.level}, experience = ${val.exp} where server_id = "${message.guild.id}" and user_id = "${userID}";`)
                    .then(r => resolve(val))
                    .catch(e => reject(e));
            })
            .catch(e => reject(e));
    });
}

function exp_fishing(con, message, userID, amount) {
    return new Promise((resolve, reject) => {
        getStats_fishing(con, message, userID)
            .then(user => {
                let val = levelUp(user.level, user.experience + amount);
                query(con, `update STATS_FISHING set level = ${val.level}, experience = ${val.exp} where server_id = "${message.guild.id}" and user_id = "${userID}";`)
                    .then(r => resolve(val))
                    .catch(e => reject(e));
            })
            .catch(e => reject(e));
    });
}

function fishing_catch_fish(con, message, userID, amount) {
    return new Promise((resolve, reject) => {
        getStats_fishing(con, message, userID)
            .then(user => {
                let num = Math.floor(user.catches + amount);
                console.log(user, amount);
                query(con, `update STATS_FISHING set catches = ${num} where server_id = "${message.guild.id}" and user_id = "${userID}";`)
                    .then(r => resolve(r))
                    .catch(e => reject(e));
            })
            .catch(e => reject(e));
    });
}

function fishing_catch_trash(con, message, userID, amount) {
    return new Promise((resolve, reject) => {
        getStats_fishing(con, message, userID)
            .then(user => {
                query(con, `update STATS_FISHING set trash = ${user.trash + amount} where server_id = "${message.guild.id}" and user_id = "${userID}";`)
                    .then(r => resolve(r))
                    .catch(e => reject(e));
            })
            .catch(e => reject(e));
    });
}

function fishing_catch_item(con, message, userID, amount) {
    return new Promise((resolve, reject) => {
        getStats_fishing(con, message, userID)
            .then(user => {
                query(con, `update STATS_FISHING set item = ${user.item + amount} where server_id = "${message.guild.id}" and user_id = "${userID}";`)
                    .then(r => resolve(r))
                    .catch(e => reject(e));
            })
            .catch(e => reject(e));
    });
}

function fishing_catch_none(con, message, userID, amount) {
    return new Promise((resolve, reject) => {
        getStats_fishing(con, message, userID)
            .then(user => {
                query(con, `update STATS_FISHING set misses = ${user.misses + amount} where server_id = "${message.guild.id}" and user_id = "${userID}";`)
                    .then(r => resolve(r))
                    .catch(e => reject(e));
            })
            .catch(e => reject(e));
    });
}

// ITEMS

function getItemList(con, tier) {
    return new Promise((resolve, reject) => {
        let str;
        if (tier == 0)
            str = `select * from MINIGAME_DATA_ITEMS_TRASH;`

        con.query(str, (err, result) => {
            if (err)
                reject(err);
            else
                resolve(result);
        });
    });
}

function getFishList(con, rarity) {
    return new Promise((resolve, reject) => {
        let str = `select * from MINIGAME_DATA_ITEMS_FISH where rarity = ${rarity};`

        con.query(str, (err, result) => {
            if (err)
                reject(err);
            else
                resolve(result);
        });
    });
}


// INVENTORY

function inventory_get(con, message) {
    return new Promise((resolve, reject) => {
        con.query(`select * from STATS_INVENTORIES where server_id = "${message.guild.id}" and user_id = "${message.author.id}";`, (err, result) => {
            if (err)
                reject(err);
            else {
                if (result.length)
                    resolve(result[0]);
                else {
                    inventory_set(con, message, { "items": [] })
                        .then(r => {
                            console.log(r);
                            inventory_get(con, message)
                                .then(r => resolve(r))
                                .catch(e => reject(e));
                        })
                        .catch(e => reject(e));
                }
            }
        })
    })
}

function inventory_set(con, message, json) {
    return new Promise((resolve, reject) => {
        let list = JSON.stringify(json);
        con.query(`insert into STATS_INVENTORIES (server_id, user_id, list) values ("${message.guild.id}", "${message.author.id}", '${list}');`, (err, result) => {
            if (err)
                reject(err);
            else
                resolve(result);
        })
    });
}

function inventory_update(con, message, json) {
    return new Promise((resolve, reject) => {
        con.query(`update STATS_INVENTORIES set list = '${JSON.stringify(json)}' where server_id = "${message.guild.id}" and user_id = "${message.author.id}";`, (err, result) => {
            if (err)
                reject(err);
            else
                resolve(result);
        })
    });
}

function inventory_give(con, message, item, amount) {
    console.log('INVENTORY GIVE', message.author.username, item, amount);
    return new Promise((resolve, reject) => {
        inventory_get(con, message)
            .then(data => {
                console.log('data', data);
                let json = JSON.parse(data.list);

                let count = 0;
                while (count < amount) {
                    json.items.push(item);
                    count++;
                }

                inventory_update(con, message, json)
                    .then(r => resolve(r))
                    .catch(e => reject(e));
            })
            .catch(e => reject(e));
    });
}

function inventory_find(con, message, data) {
    return new Promise((resolve, reject) => {
        inventory_get(con, message)
            .then(data => {
                console.log(JSON.parse(data.list).items);
            })
            .catch(e => reject(e));
    });
}

module.exports = {
    getStats,
    pay,
    exp,
    getItemList,
    getFishList,
    inventory: {
        get: (con, message) => { return inventory_get(con, message) },
        set: (con, message, json) => { return inventory_set(con, message, json) },
        give: (con, message, item, amount) => { return inventory_give(con, message, item, amount) },
        find: (con, message, data) => {return inventory_find(con, message, data)}
    },
    fishing: {
        get: (con, message, userID) => { return getStats_fishing(con, message, userID) },
        catchFish: (con, message, userID, amount) => { return fishing_catch_fish(con, message, userID, amount) },
        catchNone: (con, message, userID, amount) => { return fishing_catch_none(con, message, userID, amount) },
        catchTrash: (con, message, userID, amount) => { return fishing_catch_trash(con, message, userID, amount) },
        catchItem: (con, message, userID, amount) => { return fishing_catch_item(con, message, userID, amount) },
        exp: (con, message, userID, amount) => { return exp_fishing(con, message, userID, amount) }
    }
}