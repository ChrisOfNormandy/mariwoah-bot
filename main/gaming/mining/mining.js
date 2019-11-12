const gaming = require('../../../scripts/gaming')
const global = require('../../global');

module.exports = {
    mine: async function(message) {
        let user = message.author.id;

        if (gaming.stats[user].mining.pick.inUse) {
            if (gaming.stats[user].mining.result) {
                message.channel.send(`Collected 1x ${gaming.stats[user].mining.result.type}`);
                gaming.stats[user].mining.result = null;
                gaming.stats[user].mining.pick.inUse = false;
                gaming.pushStats();
                return;
            }
            this.checkMine(message);
            return;
        }
        
        console.log('Started mining.');
        message.channel.send(':pick: You grab your pick.');

        gaming.getUser(message)
        .then(s => {
            if (s) this.mineResult(message);
            else message.channel.send('No');
        })
        .catch(e => {
            console.log(e);
        })
    },

    checkBrokenPick: async function(message) {
        let user = message.author.id;

        if (gaming.stats[user].mining.pick.durability <= 0) {
            message.channel.send(`Oops! Your pick broke... that's not hot.`);
            setTimeout(() => {
                message.channel.send(`Here, lemme fix that for you! ~uwu~`);
                gaming.stats[user].mining.pick.durability = 20;
            }, 1000);
            return true;
        }
        return false;
    },

    updateMine: async function(userID) {
        if (gaming.stats[userID].mining.timer % 30 == 0) 
        {
            let obj = gaming.stats[userID].mining;

            gaming.updateUserByID(userID, 'mining', obj);
        }

        if (gaming.stats[userID].mining.timer % 10) {
            gaming.client.users.get('188020615989428224').send('test');
        }

        gaming.stats[userID].mining.timer--;

        if (gaming.stats[userID].mining.timer <= 0) {
            gaming.stats[userID].mining.timer = 0;
            gaming.stats[userID].mining.result = {
                type: 'test'
            };

            gaming.pushStats(gaming.stats);

            client.users.get('188020615989428224').send(
            `You found:\n` +
            `> 1 ${gaming.stats[userID].mining.result.type}\n` +
            `\n` +
            `Return to the server and type "~mine" to redeem.`
            );
            return;
        }
        
        setTimeout(() => { this.updateMine(userID); }, 1000);
    },

    checkMine: async function(message) {
        message.channel.send(`Time left: ${gaming.stats[message.author.id].mining.timer} seconds.`);
    },
    
    mineResult: async function(message) {
        let user = message.author.id;
        let timer = 60;

        if (!this.checkBrokenPick(message)) {
            console.log('Pick is broken, escaping...');
            return;
        }

        gaming.stats[user].mining.pick.inUse = true;
        gaming.stats[user].mining.timer = timer;
        
        this.checkMine(message);
        this.updateMine(user);
    }
}