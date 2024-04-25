require('dotenv').config()
const Xendit = require('xendit-node'),
    XENDIT_URL = process.env.XENDIT_URL,
    XENDIT_KEY = process.env.XENDIT_KEY

const xenditPayment = new Xendit({
    secretKey: XENDIT_KEY,
    xenditURL: XENDIT_URL,
})

module.exports = xenditPayment
