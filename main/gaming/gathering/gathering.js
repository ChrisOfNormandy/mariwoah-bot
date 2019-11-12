const gaming = require('../../../scripts/gaming');
const itemlist = require('../itemList');

module.exports = {
    availableItems: [],

    updateAvailableItems: async function() {
        this.availableItems = [];
        for (i in itemlist.fish.common) {
            try {
                if (itemlist.fish.common[i].minSize && itemlist.fish.common[i].maxSize) {
                    this.availableItems.push(i);
                }
            }
            catch (e) {
                console.log('Item went scummy.')
                console.log(e);
            }
        }
    },

    sellInv: async function(message) {
        console.log('Getting user...');
        gaming.getUser(message)
        .then(s => {
            if (!s) return;

            let list = s.inventories.items;
            let price, sellFor;
            let msg = ''

            if (list.length) {
                for (let i = 0; i < list.length; i++) {
                    try {
                        sellFor = (list[i].size * list[i].costPerItem).toFixed(2);

                        msg += `Sold ${list[i].type}. Recieved: $${sellFor}\n`
                        gaming.pay(message, Number(sellFor));
                    }
                    catch (e) {
                        console.log(e);
                        message.channel.send('Exception: Issue selling item.');
                        return;
                    }
                }

                message.channel.send(msg);
                gaming.clearInv(message, 'items');
            }
            else {
                message.channel.send('Nothing to sell!');
                return;
            }
        })
        .catch(e => {
            console.log(e);
        });
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
        });
        let msg = '';

        msg += 'Fishing:\n'
        for (let i = 0; i < this.availableItems.length; i++) {
            msg += `${this.availableItems[i].replace('_',' ')}\n`;
        }
        m.edit(msg);
    }
}