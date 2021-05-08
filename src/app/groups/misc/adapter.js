module.exports = {
    crypto: {
        any: require('./crypto/helpers/formatter'),
        doge: require('./crypto/DOGE/doge'),
        btc: require('./crypto/BTC/btc')
    }
}