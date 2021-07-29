const { Discord, Output, chatFormat } = require('@chrisofnormandy/mariwoah-bot');

const { data } = require('../players/playerdata');

/**
 * 
 * @param {string} userID 
 * @param {string} filter 
 * @returns {Promise<Output>}
 */
module.exports = (userID, filter = null) => {
    return new Promise((resolve, reject) => {
        data.inventory.list(userID)
            .then(list => {
                let embed = new Discord.MessageEmbed()
                    .setTitle('Inventory');

                let arr = [];
                for (let item in list)
                    arr.push(list[item]);

                let str = ``;

                if (filter === null) {
                    let sum;
                    for (let i in arr) {
                        sum = 0;
                        for (let a in arr[i].stack)
                            sum += arr[i].stack[a].price;
                        str += `\`${chatFormat.capFormat(arr[i].name)} x${arr[i].amount}\`\n> Worth: ${sum} U.`;
                    }
                }
                else {
                    let arr2 = arr.filter(item => { return item.type == filter; });

                    for (let i in arr2)
                        str += `\`${chatFormat.capFormat(arr2[i].name)} x${arr2[i].amount}\`\n`;
                }

                embed.addField('List', str || 'Nothing here.');

                resolve(new Output(embed).setValues(list));
            })
            .catch(err => reject(new Output().setError(err)));
    });
};