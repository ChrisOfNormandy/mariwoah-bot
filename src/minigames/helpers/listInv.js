function generateText_Fish (invArray) {
    let invFish = {};
    let msg = '';

    for (i in invArray) {
        if (!invFish[invArray[i].type]) invFish[invArray[i].type] = {count: 0, weight: 0};

        invFish[invArray[i].type].count++;
        invFish[invArray[i].type].weight += Number(invArray[i].weight);
        invFish[invArray[i].type].name = `${(invArray[i].type).charAt(0).toUpperCase()}${(invArray[i].type).slice(1)}`
        invFish[invArray[i].type].name.replace('_', ' ');

        msg += `> ${name} - x${invFish[i].count}\n> --- Worth: $${fishlist.common[i].costPerLb} / lb. Value owned: $${(fishlist.common[i].costPerLb * invFish[i].weight).toFixed(2)}\n`
    }
    if (msg == '') msg = '> Nothing found.';

    return msg;
}

module.exports = function (user, invFlag) {
    let msg = '';

    if (invFlag) {
        switch (invFlag) {
            case '-f': return generateText_Fish(user.inventories.fishing);
            case '-g': {
                let invItems = {};
                if (s.inventories.items.length) {
                    for (let i = 0; i < s.inventories.items.length; i++) {
                        if (!invItems[s.inventories.items[i].type])
                            invItems[s.inventories.items[i].type] = {count: 0};

                        invItems[s.inventories.items[i].type].count++;
                    }
                    console.log(s.inventories.items);
                    let name = '';
                    for (i in invItems) {
                        name = `${i[0].toUpperCase()}${i.slice(1)}`;
                        name.replace('_',' ');
                        //Replace _ with space...

                        msg += `> ${name} - x${invItems[i].count}\n> --- Value owned: $DontWorryAboutIt\n`
                    }
                    message.channel.send(msg);
                }
                else {
                    message.channel.send('> Nothing found.')
                }
                break;
            }
            case '-m': {
                let invMine = {};
                if (s.inventories.mining.length) {
                    for (let i = 0; i < s.inventories.mining.length; i++) {
                        
                    }
                }
                else {
                    message.channel.send('> Nothing found.')
                }
                break;
            }

            default: {
                message.channel.send('Invalid flag given.');
                return;
            }
        }
    }
    else {
        for (item in s.inventories) {
            switch (item) {
                case 'items': {
                    msg += `Items: ${s.inventories[item].length} of ${20 + s.gathering.level * 5}\n`;
                    break;
                }
                case 'fishing': {
                    msg += `Fishing: ${s.inventories[item].length} of ${20 + s.fishing.level * 5}\n`;
                    break;
                }
                case 'mining': {
                    msg += `Mining: ${s.inventories[item].length} of ${20 + s.mining.level * 5}\n`;
                    break;
                }
            }
        }
        if (msg) message.channel.send(msg);
        else message.channel.send('> Nothing here.');
        return;
    }
}