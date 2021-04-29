const profile = require('./profile');

const experience = {
    add: (userID, category, amount = 1) => {
        return new Promise((resolve, reject) => {
            profile.get(userID)
                .then(user => {
                    user.gameData.experience[category] += amount;
                    profile.set(userID, user);
                    resolve(user);
                })
                .catch(err => reject(err));
        });
    }
}

const inventory = {
    give: (userID, item, type, amount = 1) => {
        return new Promise((resolve, reject) => {
            profile.get(userID)
                .then(user => {
                    if (!user.gameData.inventory[item.name])
                        user.gameData.inventory[item.name] = {
                            name: item.name,
                            stack: [item],
                            type: type,
                            amount: amount
                        };
                    else {
                        user.gameData.inventory[item.name].stack.push(item);
                        user.gameData.inventory[item.name].amount = user.gameData.inventory[item.name].stack.length;
                    }

                    profile.set(userID, user);
                    resolve(user);
                })
                .catch(err => reject(err));
        });
    },
    list: (userID) => {
        return new Promise((resolve, reject) => {
            profile.get(userID)
                .then(user => resolve(user.gameData.inventory))
                .catch(err => reject(err));
        });
    }
}

module.exports = {
    experience,
    inventory
}