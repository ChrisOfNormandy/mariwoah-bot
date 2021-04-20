const links = require('./links');

module.exports = function (meme) {
    switch (meme) {
        case 'clayhead': return 'src/app/common/assets/memes/clay_head.gif';
        case 'f': return links.f_for_respect;
        case 'fuuu': return links.rage.fuuu;
        case 'penguin': return 'src/app/common/assets/memes/penguin_walking_gif.gif';
        case 'yey': return links.rage.yey;
        case 'bird': return 'src/app/common/assets/memes/bird_dance.gif';
        case 'thowonk': return 'src/app/common/assets/memes/thowonk.png';
        case 'extra_thicc': return 'src/app/common/assets/memes/extra_thicc.gif';
    }
}