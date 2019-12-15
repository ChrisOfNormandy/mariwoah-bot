function fishString(obj) {
    let rarity = obj.rarity.charAt(0).toUpperCase() + obj.rarity.slice(1);
    let name = obj.name.replace('_', ' ');

    let msg = ` ${rarity} ${name} - ${obj.size} inch - ${obj.weight} lbs. - $${(obj.info.costPerLb * obj.weight).toFixed(2)}\n`;
    return msg;
}

function itemString(obj) {
    let name = obj.item.name;
    name = name.charAt(0).toUpperCase() + name.slice(1);
    name = name.replace('_', ' ');
    let msg = ` ${obj.amount < 10 ? ' ' : ''}${obj.amount} | ${name}\n`;
    return msg;
}

module.exports = function(user) {
    let msgs = [];
    for (inv in user.inventories) {
        if (!user.inventories[inv].length) continue;

        title = inv.charAt(0).toUpperCase() + inv.slice(1);
        let msg = '```cs\n' + `# ${title}\n`;
        
        for (let i = 0; i < user.inventories[inv].length; i++) {
            switch (user.inventories[inv][i].category) {
                case 'fish': {msg += fishString(user.inventories[inv][i].item); break;}
                case 'items': {msg += itemString(user.inventories[inv][i]); break;}
            }
        }

        msg += '```';
        msgs.push(msg);
    }
    return msgs;
}