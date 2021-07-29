const { MessageData, Output } = require('@chrisofnormandy/mariwoah-bot');

/**
 * 
 * @param {MessageData} data 
 * @returns {Promise<Output>}
 */
module.exports = (data) => {
    let args = data.arguments;
    
    return new Promise((resolve, reject) => {
        let count = 1, sides = 6;

        if (!isNaN(args[0]) && args[0] > 1)
            sides = args[0];
        else if (args[0] == 1)
            reject(new Output().setError(new Error("Cannot roll a d1.")));

        if (!isNaN(args[1]) && args[1] >= 1 && args[1] <= 50)
            count = args[1];
        else if (args[1] > 50)
            reject(new Output().setError("Cannot roll more than 50 times at once."));

        let roll, rolls = [];

        while (count > 0) {
            roll = Math.floor(1 + Math.random() * sides);
            if (sides == 2)
                roll--;
            rolls.push(roll);
            count--;
        }

        let sum = 0, highest = 0, lowest = -1;

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

        resolve(new Output(value).setValues(rolls));
    });
};