const chatFormat = require('../../common/bot/helpers/global/chatFormat');
const csvToMap = require('./csvToMap');
const Discord = require('discord.js');
const equipmentMap = require('./equipmentMap');

function getShop(map, maxItems) {
    const shopDepts = new Map();
    let arr = [];
    let count = 0;

    map.forEach((v, k, m) => {
        if (Math.random() >= 0.5 && count < maxItems) {
            arr = [];

            for (let obj in m[k])
                arr.push(m[k][obj]);

            shopDepts.set(k, arr);
            count++;
        }
    });

    if (shopDepts.size == 0) {
        shopDepts.set('G', []);

        for (let obj in map.get('G'))
            shopDepts['G'].push(obj);
    }

    let result = new Map();
    let maxPerDept = Math.floor(maxItems / shopDepts.size);
    let max;

    let item;
    shopDepts.forEach((v, k, m) => {
        max = (v.length < maxPerDept) ? v.length : maxPerDept - Math.floor(Math.random() * maxPerDept / 2);

        if (max <= 0)
            max = 1;

        while (max > 0) {
            if (result.has(v[Math.floor(Math.random() * v.length)]))
                continue;
            item = v[Math.floor(Math.random() * v.length)];

            if (item.cost && !item.cost.includes('c') && !item.cost.includes('s') && !item.cost.includes('g'))
                item.cost += 'g';

            item['amount'] = Math.round(Math.random() * 3) + 1;

            result.set(item.name, item);
            max--;
        }
    });

    return result;
}

module.exports = {
    random: async function (message, amount) {
        return new Promise((resolve, reject) =>  {
            if (equipmentMap.map.size <= 1) {
                csvToMap()
                    .then(map => {
                        equipmentMap.map = map;
                        resolve(getShop(map, amount));
                    })
                    .catch(e => reject(e));
            }
            else {
                resolve(getShop(equipmentMap.map, amount));
            }
        });
    },
    printRandom: async function (message, amount) {
        this.random(message, amount)
            .then(map => {
                let embedMsg = new Discord.MessageEmbed()
                    .setTitle('Random shop listings')
                    .setColor(chatFormat.colors.byName.cyan);
                let str = '';
                let index = 1;
                map.forEach((v, k, m) => {
                    str += `${index}. ${v.name}: ${v.cost || 'Roll d20*d20 g'} |x| Stock: ${v.amount}\n`;
                    index++;
                });
                embedMsg.addField('Current stock:', str);
                message.channel.send(embedMsg);
            })
            .catch(e => console.log(e));
    }
}