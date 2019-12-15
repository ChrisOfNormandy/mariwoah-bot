const getUser = require('../../helpers/user/getUser');
const newInstance = require('./helpers/newInstance');
const modUser = require('../../helpers/user/modUser');

module.exports = {
    instances: new Map(),

    cast: function(message) {
        if (this.instances.has(message.author.id)) {
            message.channel.send('Please wait...').then(msg => setTimeout(() => msg.delete(), 3000));
            message.delete();
            return;
        }

        message.channel.send('Casting rod...')
        .then(msg => {
            let user = getUser(message);
            let instance = newInstance(user);
            this.instances.set(message.author.id, instance);
            setTimeout(() => {
                msg.edit('Waiting...');
            }, instance.delay * 1000 / 4);
            setTimeout(() => {
                msg.edit('Reeling in...');
            }, instance.delay * 1000 * (3/4));
            setTimeout(() => {
                if (instance.returnItem != null) {
                    modUser(user.definition.id, 'give', instance.returnItem);
                    console.log('Adding catch...');
                    modUser(user.definition.id, 'addCatch', {game: 'fishing', amount: 1, flag: 'catches'});
                    console.log('Checking level up...');
                    modUser(user.definition.id, 'levelup', {game: 'fishing', message: message})
                }
                else modUser(user.definition.id, 'addCatch', {game: 'fishing', amount: 1, flag: 'misses'});

                modUser(user.definition.id, 'giveXp', {amount: instance.expPayout});
                
                this.instances.delete(message.author.id);
                
                let newMsg = (instance.returnItem != null)
                ? (instance.returnItem.weight) 
                    ?`:fishing_pole_and_fish: ${user.definition.name}, you caught a:\n${instance.returnItem.item.size} inch, ${instance.returnItem.item.weight} lbs. ${(instance.returnItem.item.name).replace('_', ' ')}!` 
                    :`:fishing_pole_and_fish: ${user.definition.name}, you caught ${instance.returnItem.item.size} ${(instance.returnItem.item.name).replace('_', ' ')}${(instance.returnItem.item.size > 1) ? 's' : ''}!` 
                : `Tough luck, ${user.definition.name}, your line was empty.`;
                msg.edit(newMsg);
                message.delete();
            }, instance.delay * 1000);
        });
    }
}