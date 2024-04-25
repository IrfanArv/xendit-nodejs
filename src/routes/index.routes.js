const router = require('express').Router(),
    {
        payMinimum,
        verifyAPI,
        ValidationVa,
        ValidationEw,
    } = require('../middleware'),
    {
        channels,
        virtualAccount,
        getAssets,
        eWallet,
        creditCard,
        transactionPayment,
        payLater,
    } = require('../controllers')

// create channel payment
router.post('/channels', verifyAPI, channels.createPayment)
// list channel payment

router.get('/channels/:type', verifyAPI, channels.getPayment)
// create payment VA
router.post(
    '/virtual-account',
    verifyAPI,
    ValidationVa,
    payMinimum,
    virtualAccount.createVA,
)

router.post('/paid-va', virtualAccount.paidVA)
router.post('/updated-va', virtualAccount.updatedVA)

// Callback EWallet
router.post('/updated-ewallet', eWallet.updateEwallet)

// Callback token credit card
router.post('/updated-cc-token', creditCard.createToken)
router.post('/updated-cc-auth', creditCard.createAuth)

// create e Wallet Payment
router.post(
    '/e-wallet-charge',
    verifyAPI,
    ValidationEw,
    payMinimum,
    eWallet.createEw,
)

// Load Asset Channel
router.get('/assets/:name', getAssets.getFile)

//router.get("/banner-mobile", channels.temporaryBanner);

// check payment transaction
router.get('/transaction', transactionPayment.checkPaymentTransaction)

//paylater
router.post('/create-customer', payLater.createCustomer)

module.exports = router
