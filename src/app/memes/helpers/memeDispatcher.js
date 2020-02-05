const links = require('./links');

module.exports = function(meme) {
    switch (meme) {
        case 'f': return links.f_for_respect;
        case 'fuuu': return links.rage.fuuu;
        case 'yey': return links.rage.yey;
        case 'penguin': return './src/app/common/assets/penguin_walking_gif.gif'
    }
}