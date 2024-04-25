const verifyAPI = require('./verifyKey.middleware'),
    ValidationVa = require('./validationVA.middleware'),
    ValidationEw = require('./validationEw.middleware'),
    payMinimum = require('./payMinimum.middleware')

module.exports = {
    verifyAPI,
    ValidationVa,
    ValidationEw,
    payMinimum,
}
