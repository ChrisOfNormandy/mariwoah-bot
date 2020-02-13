const slotItems = {
    'gem': {
        worth: [0.1, 2, 15]
    },
    'cherries': {
        worth: [0.2, 3, 25]
    },
    'grapes': {
        worth: [0.2, 3, 50]
    },
    'watermelon': {
        worth: [0.3, 3, 75]
    },
    'bell': {
        worth: [0.3, 4, 100]
    },
    'seven': {
        worth: [0.4, 5, 250]
    },
    'fleur_de_lis': {
        worth: [0.5, 10, 1000]
    },
    'x': {
        worth: [-1, -1, -1]
    }
};
const slotItemsList = ['gem', 'cherries', 'grapes', 'watermelon', 'bell', 'seven', 'fleur_de_lis', 'x'];

module.exports = {
    items: slotItems,
    list: slotItemsList
}