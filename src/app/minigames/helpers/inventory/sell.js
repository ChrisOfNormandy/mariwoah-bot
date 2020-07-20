module.exports = function (user) {
    let sold = {};
    for (inv in user.inventories) {
        if (!user.inventories[inv].length)
            continue;

        for (let i in user.inventories[inv]) {
            let obj = user.inventories[inv][i];
            if (!sold[obj.item.name])
                sold[obj.item.name] = { amount: 0, price: 0 }
            sold[obj.item.name].amount += obj.amount;
            sold[obj.item.name].price += obj.item.worth;
        }
        user.inventories[inv] = [];
    }
    return sold;
}