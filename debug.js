const common = require('./src/app/common/adapter');

function noiseTest() {
    const noise = common.bot.global.noise;

    const height = 10;

    let str = '';
    let val = 0;
    for (let y = 0; y < 20; y++) {
        for (let x = 0; x < 20; x++) {
            val = noise.get(x, 0, y, 0.2, height, 0.1);
            
            if (val < 0.3 * height)
                str += '--';
            if (val < 0.6 * height)
                str += '||';
            if (val < 0.9 * height)
                str += 'XX';
            else
                str += '##';
        }
        str += '\n'
    }
}

module.exports = {
    run: () => {
        noiseTest();
    }
}