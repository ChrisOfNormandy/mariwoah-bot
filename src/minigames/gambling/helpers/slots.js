const slotItems = {
    'gem': {
        worth: [2, 5, 500]
    },
    'cherries': {
        worth: [0, 0, 25]
    },
    'grapes': {
        worth: [0, 0, 50]
    },
    'watermelon': {
        worth: [0, 0, 75]
    },
    'bell': {
        worth: [0, 0, 100]
    },
    'seven': {
        worth: [0, 0, 250]
    },
    'fleur_de_lis': {
        worth: [0, 0, 1000]
    }
};

function roll() {
    const val = Math.floor(Math.random() * 100);
    let offset = 0;
    let rolls = [];

    if (val < 5) {
        rolls.push(7)
    }
    else if (val >= 5 && val < 15) {
        rolls.push(6)
    }
    else if (val >= 15 && val < 30) {
        rolls.push(5)
    }
    else if (val >= 30 && val < 45) {
        rolls.push(4)
    }
    else if (val >= 45 && val < 60) {
        rolls.push(3)
    }
    else if (val >= 60 && val < 80) {
        rolls.push(2)
    }
    else if (val >= 80 && val < 100) {
        rolls.push(1)
    }
}

module.exports = {
    
}