const gaming = require('../gaming');
const global = require('../../main/global');
const itemlist = require('../itemList');
const fishlist = itemlist.fish;
const fishlootlist = itemlist.fishloot;

// Helpers
const getInfo = require('./helpers/getInfo');
const getPrice = require('./helpers/getPrice');

module.exports = {
    availableFish: [],
    availableItems: [],

    updateAvailableFish: async function () {
        this.availableFish = [];
        for (i in fishlist.common) {
            try {
                if (fishlist.common[i].minSize && fishlist.common[i].maxSize)
                    this.availableFish.push(i);
            }
            catch (e) {
                global.log('Exception: Error updating available fish.', 'error');
                console.log(e);
            }
        }
        global.log('Updated available fish.', 'info');
        this.updateAvailableItems();
    },

    updateAvailableItems: async function() {
        this.availableItems = [];
        for (i in fishlootlist.common) {
            try {
                if (fishlootlist.common[i].minSize && fishlootlist.common[i].maxSize) {
                    this.availableItems.push(i);
                }
            }
            catch (e) {
                global.log('Exception: Error updating available fishing items.', 'error');
                console.log(e);
            }
        }
        global.log('Updated available items.', 'info');
    },

    fishInfo: async function (message, fishType) {
        message.channel.send(getInfo(fishType));
    },

    sellInv: async function(message) {
        console.log('Getting user...');
        gaming.getUser(message)
        .then(s => {
            if (!s) return;

            let list = s.inventories.fishing;
            let msg = ''

            if (list.length) {
                for (let i = 0; i < list.length; i++) {
                    try {
                        let fish = getPrice(fishlist.common[list[i].type].costPerLb, list[i].weight);

                        msg += `Sold ${list[i].type} at $${fish.price}/lb. Recieved: $${fish.salePrice}\n`
                        gaming.pay(message, Number(fish.salePrice));
                    }
                    catch (e) {
                        console.log(e);
                        global.log(`Exception: Error selling fish for player ${message.author.id}.`, 'error');
                        return;
                    }
                }

                message.channel.send(msg);
                gaming.clearInv(message, 'fishing');
            }
            else {
                message.channel.send('Nothing to sell!');
                return;
            }
        })
        .catch(e => {
            console.log(e);
            global.log('Exception: Error thrown from fishing sellInv promise - caught.', 'error');
        });
    },

    listFish: async function(message) {
        const m = await message.channel.send('Grabbing a list of available fish...');
        this.updateAvailableFish()
        .then(s => {
            console.log('Refreshed available fish in the pool.');
            message.channel.send('Updated the fish in the pool.');
        })
        .catch(e => {
            console.log(e);
            global.log('Exception: Error thrown from fishing listFish -> updateAvailableFish promise - caught.', 'error')
        });
        let msg = '';

        for (let i = 0; i < this.availableFish.length; i++) {
            msg += `${this.availableFish[i].replace('_',' ')} - Min size: ${fishlist.common[this.availableFish[i]].minSize}"; Max size: ${fishlist.common[this.availableFish[i]].maxSize}"\n`;
        }
        m.edit(msg);
    },

    listItems: async function(message) {
        const m = await message.channel.send('Grabbing a list of available items...');
        this.updateAvailableItems()
        .then(s => {
            console.log('Refreshed available items in the pool.');
            message.channel.send('Updated the items in the pool.');
        })
        .catch(e => {
            console.log(e);
            global.log('Exception: Error thrown from fishing listItems -> updateAvailableItems promise - caught.', 'error')
        });
        let msg = '';

        for (let i = 0; i < this.availableItems.length; i++) {
            msg += `${this.availableItems[i].replace('_',' ')}\n`;
        }
        m.edit(msg);
    },

    checkBrokenRod: async function (message) {
        let usr = message.author.id;

        if (gaming.stats[usr].fishing.rod.durability <= 0) {
            message.channel.send(`Oops! Your rod broke... that's not hot.`);
            setTimeout(() => {
                message.channel.send(`Here, lemme fix that for you! ~uwu~`);
                let obj = gaming.stats[usr].fishing;
                obj.rod.durability = 20;
                gaming.updateUser(message, 'fishing', obj);
            }, 1000);
            return true;
        }
        return false;
    },

    getRequiredCatch: function (level) {
        let powOne = Math.round((2 * level - 1) / 32);
        let powTwo = (level % 4) / 2;
        let amount = 8 * Math.round(Math.pow(2, powOne - powTwo))
        if (level > 0)
            return amount + this.getRequiredCatch(level - 1);
        return amount;
    },

    checkLevelUp: async function (message) {
        let x = gaming.stats[message.author.id].fishing.level;
        let c = gaming.stats[message.author.id].fishing.rod.catches;
        if (c >= this.getRequiredCatch(x)) {
            gaming.stats[message.author.id].fishing.level++;
            global.log(`Leveling up player ${message.author.id} fishing by one -> ${gaming.stats[message.author.id].fishing.level}.`);
            return true;
        }
        return false;
    },

    generateFishObject: function (lvl, index) {
        let fishToUse = fishlist.common[this.availableFish[index]];
        let maxSize = (lvl < 72)
        ? (lvl <= 50)
            ? (lvl <= 30)
                ? (lvl <= 10 && lvl > 0)
                    ? Number((fishToUse.maxSize / 10).toFixed(2))
                    : Number((fishToUse.maxSize / 5).toFixed(2))
                : Number((fishToUse.maxSize / 2).toFixed(2))
            : Number(((4 / 5) * fishToUse.maxSize).toFixed(2))
        : fishToUse.maxSize;
        let size = Number(((Math.random() * (maxSize - fishToUse.minSize) + 1) + fishToUse.minSize).toFixed(2));
        if (size < fishToUse.minSize) size = fishToUse.minSize;
        let weight = fishToUse.weightFunc(size).toFixed(2);
        let fish = {
            type: this.availableFish[index],
            size: size,
            weight: weight,
            expPerLb: fishToUse.expPerLb 
        };
        global.log(`Generated a fish object: ${JSON.stringify(fish)}`);
        return fish;
    },

    generateItemObject: function (lvl, index) {
        let itemToUse = fishlootlist.common[this.availableItems[index]];
        let size = (itemToUse.minSize == itemToUse.maxSize)
        ? Number(((Math.random() * (itemToUse.maxSize - itemToUse.minSize) + 1) + itemToUse.minSize).toFixed(2))
        : itemToUse.minSize;
        let item = {
            type: this.availableItems[index],
            size: size,
            expPer: itemToUse.expPer,
            price: itemToUse.costPerItem
        };
        global.log(`Generated an item object: ${JSON.stringify(item)}`);
        return item;
    },

    caughtFish: async function (message, usr, obj) {
        let index = Math.round(Math.random() * (this.availableFish.length - 1));
        let fish;

        try {
            fish = this.generateFishObject(obj.level, index);
        }
        catch (e) {
            console.log(e);
            global.log('Exception: Error generating new fish object.', 'error');
            global.log(`Variables from exception: index: ${index}`, 'error');
            return null;
        }

        message.channel.send(`:fishing_pole_and_fish: Nice catch, ${gaming.stats[usr].user.name}! You caught a ${fish.weight}lbs. ${fish.type.replace('_',' ')} measuring ${fish.size} inches!`);
       
        try {
            if (gaming.addToInv(message, 'fishing', fish)) console.log('Successfully added fish to inventory.');
            else {
                message.channel.send('Your inventory is full, so you set the fish free.\nYou still earned experience for the catch.');
                console.log('Player inventory is full, not adding fish to inventory.');
            }
        }
        catch (e) {
            console.log(e);
            global.log(`Exception: Error adding fish object to player inventory for player ${message.author.id}.`, 'error');
            global.log(`Variables from exception: fish: ${JSON.stringify(fish)}`, 'error');
            return null;
        }

        try {
            gaming.giveExp(message, Math.floor(fish.expPerLb * fish.weight));
        }
        catch (e) {
            console.log(e);
            global.log('Exception: Error giving experience to user from fishing.', 'error');
            global.log(`Variables from exception: expPerLb: ${fish.expPerLb}; weight: ${fish.weight}.`, 'error');
            return null;
        }

        try {
            obj.rod.durability--;
            obj.rod.catches++;
            obj.rod.inUse = false;
        }
        catch (e) {
            console.log(e);
            global.log('Exception: Error updating to-set object for user stats (fishing).', 'error');
            global.log(`Variables from exception: obj: ${JSON.stringify(obj)}`, 'error');
            return null;
        }

        this.checkLevelUp(message)
        .then(s => {
            if (s) message.channel.send(`<@${message.author.id}> You've increased your proficiency in fishing.\n**NEW LEVEL: ${gaming.stats[message.author.id].fishing.level}**`);
        })
        .catch(e => {
            console.log(e);
            global.log(`Exception: Error checking levelup for player ${message.author.id}.`, 'error');
            return null;
        });

        return obj;
    },

    caughtItem: async function (message, usr, obj) {
        let index = Math.round(Math.random() * (this.availableItems.length - 1));
        let item;

        try {
            item = this.generateItemObject(obj.level, index);
        }
        catch (e) {
            console.log(e);
            global.log('Exception: Error generating item object.', 'error');
            global.log(`Variables from exception: v: ${v}; index: ${index}`, 'error');
            return null;
        }

        message.channel.send(`:fishing_pole_and_fish: Rough catch, ${gaming.stats[usr].user.name}, you caught a${'aeiouy'.includes(item.type.charAt(0)) ? 'n' : ''} ${item.type.replace('_',' ')}.`);
        
        try {
            if (gaming.addToInv(message, 'items', item)) console.log('Successfully added item to inventory.');
            else {
                message.channel.send('Your inventory is full, so you trash the item.\nYou still earned experience for the catch.');
                console.log('Player inventory is full, not adding item to inventory.');
            }
        }
        catch (e) {
            console.log(e);
            global.log(`Exception: Error adding item object to player inventory for player ${message.author.id}.`, 'error');
            global.log(`Variables from exception: item: ${JSON.stringify(item)}`, 'error');
            return null;
        }

        try {
            gaming.giveExp(message, item.expPer);
        }
        catch (e) {
            console.log(e);
            global.log(`Exception: Error giving experience from fishing to player ${message.author.id}.`, 'error');
            global.log(`Variables from exception: expPer: ${expPer}`, 'error');
            return null;
        }

        try {
            obj.rod.durability--;
            obj.rod.inUse = false;
        }
        catch (e) {
            console.log(e);
            global.log('Exception: Error updating to-set object for user stats (fishing - item).', 'error');
            global.log(`Variables from exception: obj: ${JSON.stringify(obj)}`, 'error');
            return null;
        }

        return obj;
    },

    valPercResult: function(message) {
        /*
        Chances for catching:
            fish: 20% default
            ----- min > x > 1/10 max
            low-tier item: 15% default
            medium-tier item: 9% default
            high-tier item: 1% default
            nothing: 55% default

            Level 1-10:
            fish -> 25%
            ----- min > x > 2/10 max
            low-tier item: 13%
            medium-tier item: 12%
            high-tier item: 1%
            nothing: 49%

            Level 11-30:
            fish -> 40%
            ----- min > x > 5/10 max
            low-tier item: 10%
            medium-tier item: 15%
            high-tier item: 2%
            nothing: 34%

            level 31-50:
            fish -> 50%
            ----- min > x > 8/10 max
            low-tier item: 10%
            medium-tier item: 20%
            high-tier item: 3%
            nothing: 17%

            level 51+:
            ----- min > x > max
            fish +1 every 2
            medium +1 every 5
            high +1 every 10
            ...until nothing = 0%
        */
        let lvl = gaming.stats[message.author.id].fishing.level;

        if (lvl > 0 && lvl <= 10) {
            return {
                fish: 20 + Math.floor(lvl / 2),
                lowItem: 15 - Math.floor(lvl / 5),
                medItem: 9 + Math.floor(lvl / 3),
                highItem: 1
            }
        }
        if (lvl > 10 && lvl <= 30) {
            return {
                fish: 25 + Math.floor(15 * (lvl - 10) / 20),
                lowItem: 13 - Math.floor(3 * (lvl - 10) / 20),
                medItem: 12 + Math.floor(3 * (lvl - 10) / 20),
                highItem: (lvl >= 20) ? 2 : 1
            }
        }
        if (lvl > 30 && lvl < 50) {
            return {
                fish: 40 + Math.floor(10 * (lvl - 30) / 20),
                lowItem: 10,
                medItem: 15 + Math.floor(5 * (lvl - 30) / 20),
                highItem: (lvl >= 40) ? 3 : 2
            }
        }
        if (lvl > 50 && lvl <= 72) {
            return {
                fish: 50 + Math.floor(11 * (lvl - 50) / 22), //61
                lowItem: 10,
                medItem: 20 + Math.floor(4 * (lvl - 50) / 20), //24
                highItem: 3 + Math.floor(2 * (lvl - 50) / 20) //5
            } // 61 + 10 + 24 + 5 = 100
        }

        return {fish: 20, lowItem: 15, medItem: 9, highItem: 1};
    },

    castResult: function(message) {
        let v = Math.floor(100 * Math.random());
        let usr = message.author.id;
        global.log(`Starting castResult using ${usr} data with v set to ${v}.`);

        try {
            if (!this.checkBrokenRod(message)) {
                console.log('Rod is broken, escaping...');
                return;
            }
        }
        catch (e) {
            console.log(e);
            global.log(`Exception: Error checking for broken rod for player ${message.author.id}.`, 'error');
            global.log(`Variables from exception: player fishing rod: ${JSON.stringify(gaming.stats[message.author.id].fishing.rod)}`, 'error');
            return;
        }

        let obj = gaming.stats[usr].fishing;
        global.log(`Using object: ${JSON.stringify(obj)}`);

        try {
            obj.rod.inUse = true;
            gaming.updateUser(message, 'fishing', obj);
        }
        catch (e) {
            console.log(e);
            global.log(`Exception: Error updaing user fishing rod activity for player ${message.author.id}.`, 'error');
            global.log(`Variables from exception: obj: ${JSON.stringify(obj)}`, 'error');
            return;
        }

        let chance = {};
        chance = this.valPercResult(message);
        chance.lowItem += chance.fish;
        chance.medItem += chance.lowItem;
        chance.highItem += chance.medItem;

        global.log(`Chance: ${JSON.stringify(chance)}`);
        if (!chance.fish || !chance.lowItem || !chance.medItem || !chance.highItem) {
            global.log('Fishing valPercResult returned an invalid object!', 'warn');
            chance = {fish: 20, lowItem: 15, medItem: 9, highItem: 1};
        }

        setTimeout(() => {
            if (v <= chance.fish) {
                console.log('Caught a fish!');
                this.caughtFish(message, usr, obj)
                .then(o => {
                    if (o) obj = o;
                    else message.channel.send(`Bad catch: ${o}`);
                })
                .catch(e => {
                    console.log(e);
                    global.log('Exception: Error thrown from fishing castResult -> setTimeout -> caughtFish promise - caught.', 'error');
                    global.log(`Variables from exception: player: ${message.author.id}; v: ${v}; usr: ${usr}; obj: ${JSON.stringify(obj)}`, 'error');
                    return;
                })
            }
            else if (v > chance.fish && v <= chance.highItem) { // Will be split up after more items added.
                console.log('Caught an item!');
                this.caughtItem(message, usr, obj)
                .then(o => {
                    if (o) obj = o;
                    else message.channel.send(`Bad catch: ${o}`);
                })
                .catch(e => {
                    console.log(e);
                    global.log('Exception: Error thrown from fishing castResult -> setTimeout -> caughtItem promise - caught.', 'error');
                    global.log(`Variables from exception: player: ${message.author.id}; v: ${v}; usr: ${usr}; obj: ${JSON.stringify(obj)}`, 'error');
                    return;
                })
            }
            else {
                console.log('Nothing was caught...');
                let msg = ':fish: It got away...';

                try {
                    gaming.giveExp(message, 1);
                    obj.rod.inUse = false;
                    if (Math.random() <= 0.2) {
                        obj.rod.durability--;
                        msg += '\nYour hook was snagged, requiring you to cut the line.\n_Durability -1_';
                    }
                    message.channel.send(msg);
                }
                catch (e) {
                    console.log(e);
                    global.log(`Exception: Error giving exp from fishing to player ${message.author.id}; setting object (no-catch).`, 'error');
                    global.log(`Variables from exception: obj: ${JSON.stringify(obj)}`, 'error');
                    return;
                }
            }

            try {
                gaming.updateUser(message, 'fishing', obj);
            }
            catch (e) {
                console.log(e);
                global.log(`Exception: Error pushing update to player ${message.author.id}.`, 'error');
                global.log(`Variables from exception: obj: ${JSON.stringify(obj)}`);
                return;
            }

            global.log('Finished castReturn call.');
            gaming.save()
            .then(s => {
                if (s) global.log('Saved stats successfully.');
            })
            .catch(e => {
                global.log('Exception: Error thrown from fishing castResult -> setTimeout -> gaming.save promise - caught.', 'error');
                global.log(e, 'warn');
            });
        }, 5000);
    },

    breakRod: async function(message) {
        let usr = message.author.id;
        if (gaming.stats[usr]) {
            gaming.stats[usr].fishing.rod.durability = 0;
            gaming.stats[usr].fishing.rod.inUse = false;
            gaming.toStats(gaming.stats[message.author.id]);
            message.channel.send(`Your new rod: ${gaming.stats[usr].fishing.rod.durability}`);
            return;
        }

        message.channel.send(`No.`);
    },

    cast: async function(message) {
        let usr = message.author.id;

        if (!gaming.stats) {
            message.channel.send('Invalid data: gaming.stats is invalid.');
            return;
        }

        if (gaming.stats[usr].fishing.rod.inUse === undefined) gaming.stats[usr].fishing.rod.inUse = false;
        if (gaming.stats[usr].fishing.rod.inUse) {
            console.log('Rod already in use.');
            return;
        }

        console.log('Casting rod...');
        message.channel.send('Casting rod...');

        gaming.getUser(message)
        .then(s => {
            if (!s) return;
            this.castResult(message);
        })
        .catch(e => {
            console.log(e);
            global.log(`Exception: Error thrown from fishing cast -> getUser promise - caught.`, 'error');
            global.log(`Variables from exception: player: ${message.author.id}`, 'error');
        })
    }
}