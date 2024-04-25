const channels = require('./channels/'),
    virtualAccount = require('./payments/va'),
    getAssets = require('./getImage'),
    eWallet = require('./payments/ewallet'),
    creditCard = require('./payments/cc'),
    transactionPayment = require('./payments/transaction'),
    payLater = require('./payments/paylater')

module.exports = {
    channels,
    virtualAccount,
    getAssets,
    eWallet,
    creditCard,
    transactionPayment,
    payLater
}
