const { payment_settings } = require('../models')
module.exports = async function (req, res, next) {
    try {
        let { channelCode, totalPayment } = req.body
        getChannel = await payment_settings.findOne({
            attributes: ['channelCode', 'minimumAmount'],
            where: {
                channelCode: channelCode,
            },
        })
        // console.log(getChannel)
        if (totalPayment < getChannel.minimumAmount) {
            return res.status(400).send({
                status: 400,
                success: false,
                message: 'Process Failed',
                data: {
                    errors: `Pembayaran tidak dapat diproses, jumlah minimal pembayaran harus ${getChannel.minimumAmount}`,
                },
            })
        }
        next()
    } catch (err) {
        return res.status(400).send({
            status: 400,
            message: 'Bad Request sdgs',
            data: {
                errors: err.message,
            },
        })
    }
}
