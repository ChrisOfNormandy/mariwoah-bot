const links = require('./links');

module.exports = function (meme) {
    switch (meme) {
        case 'clayhead': return 'src/app/common/assets/memes/clay_head.gif';
        case 'f': return links.f_for_respect;
        case 'fuuu': return links.rage.fuuu;
        case 'penguin': return 'src/app/common/assets/memes/penguin_walking_gif.gif';
        case 'yey': return links.rage.yey;
    }
}