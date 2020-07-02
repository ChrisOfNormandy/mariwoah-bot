// const csvToMap = require('./helpers/csvToMap');
// const getItem = require('./helpers/getItem');
// const getShop = require('./helpers/getShop');
// const listItems = require('./helpers/listItems');

module.exports = {
    csvToMap: async function () { return await csvToMap(); },

    getItem: function (message, itemName) {
        getItem(itemName)
            .then(obj => {
                let cost = obj.cost;
                if (!cost.includes('c') && !cost.includes('s'))
                    cost += 'g';

                message.channel.send(`${obj.name}: ${cost} per ${obj.weight} lbs.${(obj.note) ? '\nNotes: ' + obj.note : ''}`);
            })
            .catch(e => {
                console.log(e);
                message.channel.send(`Couldn't find item ${itemName}. Check spelling and capitalization.`);
            });
    },

    getShop: function(message, amount) {
        getShop.printRandom(message, amount);
    },

    listItems: function (message, itemClass) {
        listItems(itemClass)
            .then(obj => {
                let str = '';
                for (let i in obj)
                    str += `${i}\n`;
                message.channel.send(str);
            })
            .catch(e => console.log(e));
    }
}