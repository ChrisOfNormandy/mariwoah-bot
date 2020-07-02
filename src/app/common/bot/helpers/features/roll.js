module.exports = function (args) {
    let count = 1;
    let sides = 6;
    
    if (!isNaN(args[0]) && args[0] > 1)
        sides = args[0];
    else if (args[0] == 1)
        return {value: "Cannot roll a d1."};

    if (!isNaN(args[1]) && args[1] >= 1 && args[1] <= 50)
        count = args[1];
    else if (args[1] > 50)
        return {value: "Cannot roll more than 50 times at once."};

    let rolls = [];
    let roll;

    while (count > 0) {
        roll = Math.floor(1 + Math.random() * sides);
        if (sides == 2)
            roll--;
        rolls.push(roll);
        count--;
    }

    let sum = 0;
    let highest = 0;
    let lowest = -1;

    if (rolls.length > 1) {
        for (let r in rolls) {
            if (rolls[r] > highest)
                highest = rolls[r];
            if (rolls[r] < lowest || lowest == -1)
                lowest = rolls[r];
            sum += rolls[r];
        }
    }

    let value = `Rolled: ${rolls.join(", ")}`;
    if (rolls.length > 1) {
        value = (sides > 2)
            ? `Rolled: ${rolls.join(", ")}\n\nSum: ${sum}\nHighest: ${highest}\nLowest: ${lowest}`
            : `Flipped: ${rolls.join(", ")}\n\nHeads: ${sum}\nTails: ${rolls.length - sum}`;
    }
    return {value}
}