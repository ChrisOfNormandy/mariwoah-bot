const db = require('../../../../../sql/adapter');

module.exports = function (level, tier) {
    return new Promise((resolve, reject) => {
        db.minigames.getFishList(tier)
        .then(list => {
            let index = Math.floor(Math.random() * list.length);
            let obj = list[index];
            obj.conditions = JSON.parse(obj.conditions);
            let fish = obj.conditions;

            let maxSize = (level < 72)
                ? (level <= 50)
                    ? (level <= 30)
                        ? (level <= 10 && level > 0)
                            ? Number((fish.maxSize / 10).toFixed(2))
                            : Number((fish.maxSize / 5).toFixed(2))
                        : Number((fish.maxSize / 2).toFixed(2))
                    : Number(((4 / 5) * fish.maxSize).toFixed(2))
                : fish.maxSize;

            let size = Number(((Math.random() * (maxSize - fish.minSize) + 1) + fish.minSize).toFixed(2));
            if (size < fish.minSize)
                size = fish.minSize;

            console.log(maxSize);
            console.log(size);
            console.log(fish.weights)

            let weight = Number((Math.pow(10, Number(fish.weights[0]) + Number(fish.weights[1]) * Math.log10(size))).toFixed(2));

            console.log(weight);

            resolve([
                obj, {
                    size,
                    weight,
                    costPerLb: fish.costPerLb
                }
            ])
        });
    })
}