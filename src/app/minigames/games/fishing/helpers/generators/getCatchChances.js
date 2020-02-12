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

module.exports = function (level) {
    if (level > 0 && level <= 10) {
        return {
            fish: 20 + Math.floor(level / 2),
            lowItem: 15 - Math.floor(level / 5),
            medItem: 9 + Math.floor(level / 3),
            highItem: 1
        }
    }
    if (level > 10 && level <= 30) {
        return {
            fish: 25 + Math.floor(15 * (level - 10) / 20),
            lowItem: 13 - Math.floor(3 * (level - 10) / 20),
            medItem: 12 + Math.floor(3 * (level - 10) / 20),
            highItem: (level >= 20) ? 2 : 1
        }
    }
    if (level > 30 && level < 50) {
        return {
            fish: 40 + Math.floor(10 * (level - 30) / 20),
            lowItem: 10,
            medItem: 15 + Math.floor(5 * (level - 30) / 20),
            highItem: (level >= 40) ? 3 : 2
        }
    }
    if (level > 50 && level <= 72) {
        return {
            fish: 50 + Math.floor(11 * (level - 50) / 22), //61
            lowItem: 10,
            medItem: 20 + Math.floor(4 * (level - 50) / 20), //24
            highItem: 3 + Math.floor(2 * (level - 50) / 20) //5
        } // 61 + 10 + 24 + 5 = 100
    }

    return { fish: 20, lowItem: 15, medItem: 9, highItem: 1 };
}