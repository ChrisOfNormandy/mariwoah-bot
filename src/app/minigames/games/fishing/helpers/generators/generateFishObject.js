const db = require('../../../../../sql/adapter');

module.exports = function (level, tier) {
    return new Promise((resolve, reject) => {
        db.minigames.getFishList(tier)
            .then(list => {
                let index = Math.floor(Math.random() * list.length);
                let fish = list[index];

                let divisor = (-5.5 / 100) * level + 5.5;
                let length = Number((fish.length / divisor).toFixed(2));

                let size = Number(((Math.random() * (length - length * 0.5) + 1) + length * 0.5).toFixed(2));

                let val_a = fish.intercept + fish.slope * Math.log10(fish.length);
                let val_b = Math.pow(10, val_a)
                let weight = Math.abs(Math.log10(val_b)).toFixed(2);

                resolve({
                    fish,
                    size,
                    weight
                })
            });
    })
}