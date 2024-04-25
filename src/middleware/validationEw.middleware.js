const { payment_settings } = require('../models')
module.exports = async function (req, res, next) {
    try {
        let { orderID, channelCode, totalPayment } = req.body
        if (!orderID) {
            return res.status(400).send({
                status: 400,
                message: 'Order ID wajib diisi!',
            })
        }
        if (!totalPayment) {
            return res.status(400).send({
                status: 400,
                message: 'Total bayar wajib diisi!',
            })
        }
        let checkChannel = await payment_settings.findOne({
            where: {
                channelCode: channelCode,
            },
        })
        if (!checkChannel) {
            return res.status(400).send({
                status: 400,
                message: 'Kode Channel tidak tersedia',
            })
        }
        next()
    } catch (err) {
        return res.status(400).send({
            status: 400,
            message: 'Bad Request',
            data: {
                errors: err.message,
            },
        })
    }
}
