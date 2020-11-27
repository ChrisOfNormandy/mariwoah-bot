module.exports = {
    eval: require('./math/eval'),
    sin: require('./math/trigonometry').sin,
    cos: require('./math/trigonometry').cos,
    tan: require('./math/trigonometry').tan,
    round: require('./math/format').round,
    floor: require('./math/format').floor,
    random: require('./math/random'),
    sci: require('./math/format').scientific,
    log: require('./math/logorithms').log,
    ln: require('./math/logorithms').ln
}