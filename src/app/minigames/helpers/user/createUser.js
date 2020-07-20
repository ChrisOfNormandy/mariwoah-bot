module.exports = function (message) {
    return {
        definition: {
            id: message.author.id,
            name: message.author.username
        },
        stats: {
            money: 0,
            experience: 0,
            games: {
                fishing: {
                    level: 0,
                    catches: 0,
                    misses: 0
                },
                gathering: {
                    level: 0,
                    catches: 0,
                    misses: 0
                },
                mining: {
                    level: 0,
                    catches: 0,
                    misses: 0
                },
                gambling: {
                    slots: {
                        wins: 0,
                        loses: 0,
                        totalWins: 0,
                        totalLoses: 0
                    },
                    blackjack: {
                        wins: 0,
                        loses: 0,
                        totalWins: 0,
                        totalLoses: 0
                    }
                }
            }
        },
        inventories: {
            items: [],
            fish: []
        }
    };
}