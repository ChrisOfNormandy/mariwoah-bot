module.exports = function(message, user) {
    let msgArray = message.content.split(' ');

    if (!msgArray[1]) {
        message.channel.send('Please place a bet.');
        return -1;
    }
    if (isNaN(msgArray[1])) {
        message.channel.send('Please place a valid bet.');
        return -1;
    }
    const bet = Math.floor(msgArray[1]);
    if (bet == 0) {
        message.channel.send('Please place a positive whole number bet.');
        return -1;
    }
    if (user.stats.money < bet) {
        message.channel.send("You don't have enough money to make that bet.");
        return -1;
    }
    let rollCount;
    if (!msgArray[2]) rollCount = 1;
    else {
        if (isNaN(msgArray[2])) rollCount = 1;
        else rollCount = Math.floor(msgArray[2]);
    }

    message.channel.send('Starting slots...');

    let game = {
        bet: bet,
        rollCount: rollCount,
        payout: -1
    }

    return game;
}