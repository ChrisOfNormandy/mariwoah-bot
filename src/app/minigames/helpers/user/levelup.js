module.exports = {
    set: function (user, game) {
        let val = this.get(user.stats.games[game].level);
        if (user.stats.games[game].catches >= val) {
            user.stats.games[game].level += 1;
            return user;
        }
        return false;
    },

    get: function (level) {
        let count = 0;
        let amount = 0;
        while (count <= level) {
            amount += Math.round(Math.pow(count, ((5 * count) / 2) * 1 / 250) + 4);
            count++;
        }
        return amount;
    }
}