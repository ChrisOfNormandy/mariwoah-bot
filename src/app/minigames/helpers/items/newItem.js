const itemlist = require('./itemlist');

function fish(tier, name, argsObject) {
    let args = argsObject;
    if (args.size == undefined)
        return console.error('Generating a new fish item needs argument object size!');

    let size = (args.size > 0) ? args.size : itemlist.fish[tier][name].minSize;
    let weight = itemlist.fish[tier][name].weightFunc(size);
    let worth = itemlist.fish[tier][name].costPerLb * weight;

    size = Number(size.toFixed(2));
    weight = Number(weight.toFixed(2));
    worth = Number(worth.toFixed(2));

    return {
        name: name,
        rarity: tier,
        size: size,
        weight: weight,
        worth: worth,
        info: {
            link: itemlist.fish[tier][name].link,
            image: itemlist.fish[tier][name].image,
            waterType: itemlist.fish[tier][name].type,
            catchTime: itemlist.fish[tier][name].time,
            costPerLb: itemlist.fish[tier][name].costPerLb
        }
    }
}

function item(tier, name, argsObject, itemType = 'fishloot') {
    let args = argsObject;
    if (args.size == undefined)
        return console.error('Generating a new fish item needs argument object size!');

    let size = (args.size > 0) ? args.size : itemlist.fishloot[tier][name].minSize;
    size = Number(size.toFixed(2));

    return {
        name: name,
        rarity: tier,
        size: size,
        worth: Number((itemlist[itemType][tier][name].costPerItem * size).toFixed(2)),
        itemType: itemType,
        info: {
            link: itemlist[itemType][tier][name].link,
            image: itemlist[itemType][tier][name].image,
            catchTime: (itemType == 'fishloot') ? itemlist[itemType][tier][name].time : null
        }
    }
}

function newObject(category, amount, object) {
    return {
        category: category,
        amount: amount,
        item: object
    }
}

module.exports = {
    fish: function (amount, tier, name, argsObject) {
        return newObject('fish', amount, fish(tier, name, argsObject));
    },
    item: function (amount, tier, name, argsObject) {
        return newObject('items', amount, item(tier, name, argsObject));
    }
}