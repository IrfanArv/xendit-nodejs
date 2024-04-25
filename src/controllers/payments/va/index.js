require('dotenv').config()
const { xenditPayment, dates } = require('../../../utils'),
    { payment_transactions, payment_expired } = require('../../../models'),
    VirtualAcc = xenditPayment.VirtualAcc,
    virtualAccount = new VirtualAcc({})

let axios = require('axios'),
    servicePPOB = process.env.SERVICE_PPOB,
    serviceTransaction = process.env.SERVICE_TR

module.exports = {
    async createVA(req, res) {
        try {
            let {
                    orderID,
                    channelCode,
                    customerName,
                    totalPayment,
                    typeOrder,
                    inquiryId,
                } = req.body,
                now = new Date()

            const getPaymentExpired = await payment_expired.findOne({
                where: { transaction_type: typeOrder },
            })
            const {
                days = 0,
                hours = 0,
                minutes = 0,
                seconds = 0,
            } = getPaymentExpired.expired_time_interval
            let expiredPayment = ''

            if (getPaymentExpired === null) {
                expiredPayment = dates.addHours(3, now) // set default 3 hours if query error
            } else {
                expiredPayment = dates.addTime(
                    { days, hours, minutes, seconds },
                    now,
                )
            }
            await virtualAccount
                .createFixedVA({
                    externalID: orderID,
                    bankCode: channelCode,
                    name: customerName,
                    isSingleUse: true,
                    isClosed: true,
                    expectedAmt: totalPayment,
                    expirationDate: expiredPayment,
                })
                .then(async (results) => {
                    await payment_transactions
                        .create({
                            referenceId: results.id,
                            typeOrder: typeOrder,
                            inquiryId: inquiryId,
                            orderId: results.external_id,
                            buyerName: customerName,
                            paymentMethod: 'Virtual Account',
                            channelCode: channelCode,
                            accountNumber: results.account_number,
                            status: results.status,
                            expiredTime: results.expiration_date,
                            total: totalPayment,
                        })
                        .then((transactionResults) => {
                            return res.status(200).send({
                                status: 200,
                                success: true,
                                message: 'Success',
                                data: {
                                    typeOrder: typeOrder,
                                    paymentMethod:
                                        transactionResults.channelCode +
                                        ' Virtual Account',
                                    accountNumber:
                                        transactionResults.accountNumber,
                                    orderID: transactionResults.orderId,
                                    total: transactionResults.total,
                                    status: transactionResults.status,
                                    expirationDate:
                                        transactionResults.expiredTime,
                                },
                            })
                        })
                })
        } catch (err) {
            return res.status(400).send({
                status: 400,
                success: false,
                message: 'Bad Request',
                data: {
                    errors: err.message,
                },
            })
        }
    },

    async paidVA(req, res) {
        try {
            let incomeCallback = req.headers['x-callback-token'],
                validCallBack = process.env.XENDIT_CALLBACK
            if (incomeCallback === validCallBack) {
                let { payment_id, external_id, id } = req.body
                await payment_transactions
                    .update(
                        {
                            status: 'PAID',
                            paymentId: payment_id,
                            referenceId: id,
                        },
                        {
                            where: {
                                orderId: external_id,
                                status: 'ACTIVE',
                            },
                        },
                    )
                    .then(async () => {
                        await payment_transactions
                            .findAll({
                                attributes: ['typeOrder', 'inquiryId'],
                                where: {
                                    orderId: external_id,
                                },
                                order: [['createdAt', 'DESC']],
                                limit: 1,
                            })
                            .then(async (results) => {
                                const typeOrder = results[0].typeOrder
                                const resinquiryId = results[0].inquiryId

                                switch (typeOrder) {
                                    case 'product':
                                        await axios({
                                            method: 'post',
                                            url: `${serviceTransaction}transaction/services/updateTransaction`,
                                            headers: {
                                                'Content-Type':
                                                    'application/json',
                                            },
                                            data: {
                                                transactionId: external_id,
                                                transactionStatus: 'paid',
                                                transactionDesc:
                                                    'Pembayaran telah terverifikasi',
                                                notif_title:
                                                    'Pembayaran Berhasil',
                                                notif_desc:
                                                    'Pembayaran telah terverifikasi',
                                                notif_clickAction: 'fffff',
                                            },
                                        })
                                        break
                                    case 'ppob':
                                        await axios({
                                            method: 'post',
                                            url: `${serviceTransaction}transaction/services/updateTransaction`,
                                            headers: {
                                                'Content-Type':
                                                    'application/json',
                                            },
                                            data: {
                                                transactionId: external_id,
                                                transactionStatus: 'paid',
                                                transactionDesc:
                                                    'Pembayaran telah terverifikasi',
                                                notif_title:
                                                    'Pembayaran Berhasil',
                                                notif_desc:
                                                    'Pembayaran telah terverifikasi',
                                                notif_clickAction: 'fffff',
                                            },
                                        }).then(async () => {
                                            await axios({
                                                method: 'post',
                                                url: `${servicePPOB}ppob/ppob/payForThePPOB`,
                                                headers: {
                                                    'Content-Type':
                                                        'application/json',
                                                },
                                                data: {
                                                    inquiryId: resinquiryId,
                                                    transactionId: external_id,
                                                },
                                            })
                                        })
                                        break
                                    default:
                                        console.log(
                                            'tipe transaksi tidak diketahui',
                                        )
                                }
                            })
                    })
                return res.sendStatus(200)
            } else {
                return res.status(400).send({
                    status: 400,
                    message: 'token callback invalid',
                    data: {
                        errors: err.message,
                    },
                })
            }
        } catch (err) {
            return res.status(400).send({
                status: 400,
                success: false,
                message: 'Bad Request',
                data: {
                    errors: err.message,
                },
            })
        }
    },

    async updatedVA(req, res) {
        try {
            let {
                id,
                owner_id,
                external_id,
                merchant_code,
                account_number,
                bank_code,
                name,
                is_closed,
                expiration_date,
                is_single_use,
                status,
                created,
                updated,
            } = req.body
            await payment_transactions.update(
                {
                    status: status,
                    referenceId: id,
                    expiredTime: expiration_date,
                },
                {
                    where: {
                        orderId: external_id,
                    },
                },
            )

            return res.sendStatus(200)
        } catch (err) {
            return res.status(400).send({
                status: 400,
                success: false,
                message: 'Bad Request',
                data: {
                    errors: err.message,
                },
            })
        }
    },
}
