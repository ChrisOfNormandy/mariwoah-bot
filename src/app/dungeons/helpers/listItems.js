const csvToMap = require('./csvToMap');
const equipmentMap = require('./equipmentMap');

function check(className) {
    let sect = '';
    switch (className) {
        case 'Arcane Focus': { }
        case 'arcane focus': { }
        case 'AF': { }
        case 'af': {
            sect = 'AF';
            break;
        }
        case 'Adventuring Gear': { }
        case 'adventuring gear': { }
        case 'AG': { }
        case 'ag': {
            sect = 'AG';
            break;
        }
        case 'Ammunition': { }
        case 'ammunition': { }
        case 'Ammo': { }
        case 'ammo': {
            sect = 'AMMO';
            break;
        }
        case 'Druidic Focus': { }
        case 'druidic focus': { }
        case 'DF': { }
        case 'df': {
            sect = 'DF';
            break;
        }
        case 'Equipment Pack': { }
        case 'equipment pack': { }
        case 'EP': { }
        case 'ep': {
            sect = 'EP';
            break;
        }
        case 'Firearm Ranged Weapon': { }
        case 'firearm ranged weapon': { }
        case 'Firearm': { }
        case 'firearm': { }
        case 'FRW': { }
        case 'frw': { }
        case 'F': { }
        case 'f': {
            sect = 'FRW';
            break;
        }
        case 'Gemstone': { }
        case 'gemstone': { }
        case 'G': { }
        case 'g': {
            sect = 'G';
            break;
        }
        case 'Heavy Armor': { }
        case 'Heavy Armour': { }
        case 'heavy armor': { }
        case 'heavy armour': { }
        case 'HA': { }
        case 'ha': {
            sect = 'HA';
            break;
        }
        case 'Holy Symbol': { }
        case 'holy symbol': { }
        case 'HS': { }
        case 'hs': {
            sect = 'HS';
            break;
        }
        case 'Light Armor': { }
        case 'Light Armour': { }
        case 'light armor': { }
        case 'light armour': { }
        case 'LA': { }
        case 'la': {
            sect = 'LA';
            break;
        }
        case 'Mount': { }
        case 'mount': { }
        case 'M': { }
        case 'm': {
            sect = 'M';
            break;
        }
        case 'Medium Armor': { }
        case 'Medium Armour': { }
        case 'medium armor': { }
        case 'medium armour': { }
        case 'MA': { }
        case 'ma': {
            sect = 'MA';
            break;
        }
        case 'Martial Melee Weapon': { }
        case 'martial melee weapon': { }
        case 'MMW': { }
        case 'mmw': {
            sect = 'MMY';
            break;
        }
        case 'Martial Ranged Weapon': { }
        case 'martial ranged weapon': { }
        case 'MRW': { }
        case 'mrw': {
            sect = 'MRW';
            break;
        }
        case 'Poison': { }
        case 'poison': { }
        case 'P': { }
        case 'p': {
            sect = 'P';
            break;
        }
        case 'Potion': { }
        case 'potion': { }
        case 'PO': { }
        case 'po': {
            sect = 'PO';
            break;
        }
        case 'Shield': { }
        case 'shield': { }
        case 'S': { }
        case 's': {
            sect = 'S';
            break;
        }
        case 'Simple Melee Weapon': { }
        case 'simple melee weapon': { }
        case 'SMW': { }
        case 'smw': {
            sect = 'SMW';
            break;
        }
        case 'Simple Ranged Weapon': { }
        case 'simple ranged weapon': { }
        case 'SRW': { }
        case 'srw': {
            sect = 'SRW';
            break;
        }
        case 'Tool': { }
        case 'tool': { }
        case 'T': { }
        case 't': {
            sect = 'T';
            break;
        }
        case 'Land Vehicle': { }
        case 'land vehicle': { }
        case 'LV': { }
        case 'lv': {
            sect = 'VL';
            break;
        }
        case 'Water Vehicle': { }
        case 'water vehicle': { }
        case 'WV': { }
        case 'wv': {
            sect = 'VW';
            break;
        }
    }

    if (equipmentMap.map[sect])
        return equipmentMap.map[sect];

    return null;
}

module.exports = async function (className) {
    return new Promise((resolve, reject) =>  {
        let val;
        if (equipmentMap.map.size <= 1) {
            csvToMap().then(map => {
                equipmentMap.map = map;

                val = check(className);
                if (val == null)
                    reject(val);
                else
                    resolve(val);
            });
        }
        else {
            val = check(className);
            if (val == null)
                reject(val);
            else
                resolve(val);
        }
    });
}