const global = require('../main/global');
const itemlist = require('../minigames/itemList');
const pullStats = require('./helpers/pullStats');
const pushStats = require('./helpers/pushStats');
const newUser = require('./helpers/createUser');

const fishlist = itemlist.fish;

// Exports
module.exports = {

    stats: null,
    client: null,

    getUser: async function (message) {
        let _this = this;
        return new Promise (function (resolve, reject) {
            try {
                if (_this.stats === null || !_this.stats[message.author.id]) {
                    let newUser = _this.addUser(message);
                    if (newUser !== null) resolve(newUser);
                    else reject(false);
                }
                else {
                    resolve(_this.stats[message.author.id]);
                }
            }
            catch (e) {
                console.log(e);
                reject(false);
            }
        });
    },

    addUser: function (message) {
        if (this.stats) {
            this.stats[message.author.id] = newUser(message);
        }
        else {
            this.stats = {};
            this.stats[message.author.id] = newUser(message);
        }
        pushStats(this.stats);
        return this.stats[message.author.id];
    },

    save: async function () {
        let _this = this;
        return new Promise (function (resolve, reject) {
            try {
                if (_this.stats === null) {
                    reject(_this.stats);
                    return;
                }
                pushStats(_this.stats);
                resolve(true);
            }
            catch (e) {
                console.log(e);
                reject(false);
            }
        })
    },

    // Do By User
    updateUserByID: function (userID, obj_name, object) {
        this.stats[userID][obj_name] = object;
    },

    addToInvByID: function (userID, inv_name, object) {
        switch (inv_name) {
            case 'items': {
                if (this.stats[userID].inventories[inv_name].length < this.stats[userID].gathering.level * 5 + 20) {
                    this.stats[userID].inventories[inv_name].push(object);
                    return true;
                }
            }
            default: {
                if (this.stats[userID].inventories[inv_name].length < this.stats[userID][inv_name].level * 5 + 20) {
                    this.stats[userID].inventories[inv_name].push(object);
                    return true;
                }
            }
        }
        return false;
    },

    clearInvByID: function (userID, inv_name) {
        if (this.stats[userID].inventories[inv_name].length) this.stats[userID].inventories[inv_name] = [];
    },

    payByID: function (userID, amount) {
        this.stats[userID].stats.money += amount;
    },

    giveExpByID: function (userID, amount) {
        this.stats[userID].stats.experience += Number(amount);
    },

    // Do By Message
    updateUser: async function (message, obj_name, object) {
        this.updateUserByID(message.author.id, obj_name, object);
    },

    updateAllUsers: async function (obj_name, object) {
        for (i in this.stats) {
            this.stats[i][obj_name] = object;
            console.log(this.stats[i]);
        }
    },

    addToInv: function (message, inv_name, object) {
        return this.addToInvByID(message.author.id, inv_name, object);
    },

    clearInv: function (message, inv_name) {
        this.clearInvByID(message.author.id, inv_name);
    },

    pay: function (message, amount) {
        this.payByID(message.author.id, amount);
    },

    giveExp: function (message, amount) {
        this.giveExpByID(message.author.id, amount);
    },

    // Listing
    listInventory: function (message, invFlag) {
        this.getUser(message)
        .then(s => {
            if (!s) return;

            let msg = '';

            if (invFlag) {
                switch (invFlag) {
                    case '-f': {
                        let invFish = {};
                        if (s.inventories.fishing.length) {
                            for (let i = 0; i < s.inventories.fishing.length; i++) {
                                if (!invFish[s.inventories.fishing[i].type])
                                    invFish[s.inventories.fishing[i].type] = {count: 0, weight: 0};

                                invFish[s.inventories.fishing[i].type].count++;
                                invFish[s.inventories.fishing[i].type].weight += Number(s.inventories.fishing[i].weight);
                            }
                            console.log(s.inventories.fishing);
                            let name = '';
                            for (i in invFish) {
                                name = `${i[0].toUpperCase()}${i.slice(1)}`;
                                name.replace('_',' ');
                                //Replace _ with space...

                                msg += `> ${name} - x${invFish[i].count}\n> --- Worth: $${fishlist.common[i].costPerLb} / lb. Value owned: $${(fishlist.common[i].costPerLb * invFish[i].weight).toFixed(2)}\n`
                            }
                            message.channel.send(msg);
                        }
                        else {
                            message.channel.send('> Nothing found.')
                        }
                        break;
                    }
                    case '-g': {
                        let invItems = {};
                        if (s.inventories.items.length) {
                            for (let i = 0; i < s.inventories.items.length; i++) {
                                if (!invItems[s.inventories.items[i].type])
                                    invItems[s.inventories.items[i].type] = {count: 0};

                                invItems[s.inventories.items[i].type].count++;
                            }
                            console.log(s.inventories.items);
                            let name = '';
                            for (i in invItems) {
                                name = `${i[0].toUpperCase()}${i.slice(1)}`;
                                name.replace('_',' ');
                                //Replace _ with space...

                                msg += `> ${name} - x${invItems[i].count}\n> --- Value owned: $DontWorryAboutIt\n`
                            }
                            message.channel.send(msg);
                        }
                        else {
                            message.channel.send('> Nothing found.')
                        }
                        break;
                    }
                    case '-m': {
                        let invMine = {};
                        if (s.inventories.mining.length) {
                            for (let i = 0; i < s.inventories.mining.length; i++) {
                                
                            }
                        }
                        else {
                            message.channel.send('> Nothing found.')
                        }
                        break;
                    }

                    default: {
                        message.channel.send('Invalid flag given.');
                        return;
                    }
                }
            }
            else {
                for (item in s.inventories) {
                    switch (item) {
                        case 'items': {
                            msg += `Items: ${s.inventories[item].length} of ${20 + s.gathering.level * 5}\n`;
                            break;
                        }
                        case 'fishing': {
                            msg += `Fishing: ${s.inventories[item].length} of ${20 + s.fishing.level * 5}\n`;
                            break;
                        }
                        case 'mining': {
                            msg += `Mining: ${s.inventories[item].length} of ${20 + s.mining.level * 5}\n`;
                            break;
                        }
                    }
                }
                if (msg) message.channel.send(msg);
                else message.channel.send('> Nothing here.');
                return;
            }
        })
        .catch (e => {
            console.log(e);
            global.log(`Exception: Error listing player inventory for player ${message.author.id}.`, 'error');
        })
    },

    listStats: function(message) {
        console.log('Getting user...');
        this.getUser(message)
        .then(s => {
            if (!s){
                message.channel.send(`Couldn't find user data, so it was either newly generated or there's a legit error.\nRedo command and let's find out!`);
                console.log('Bad getUser data.');
                console.log(s);
                return;
            }

            let msg = 
            `| **Username**: _${s.user.name}_\n` +
            `> **Money**: _$${(s.stats.money).toFixed(2)}_\n` +
            `> **Experience**: _${s.stats.experience} xp_\n` +
            `| **Minigame Statistics**:\n` +
            `> **Fishing**: Level ${s.fishing.level} | Catches - ${s.fishing.rod.catches}\n` +
            `> ... Durability - ${s.fishing.rod.durability} / 20 | In use: ${s.fishing.rod.inUse}\n` + 
            `> **Mining**: Level ${s.mining.level} | WIP\n` +
            `> ... Durability - ${s.mining.pick.durability} / 20 | In use: ${s.mining.pick.inUse}\n` +
            `> **Gathering**: Level ${s.gathering.level} | WIP\n` +
            `> ... W I P`

            message.channel.send(msg);
        })
        .catch(e => {
            console.log(e);
            global.log(`Exception: Error listing player stats for player ${message.author.id}.`, 'error');
        })
    },
}