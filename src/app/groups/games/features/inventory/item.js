module.exports = {
    create: (name, rarity, price, description = "") => {
        return {
            name,
            rarity,
            price,
            description
        };
    }
}