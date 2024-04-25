require('dotenv').config()
const { xenditPayment } = require('../../../utils'),
    { payment_transactions } = require('../../../models'),
    ew = xenditPayment.EWallet,
    eWallet = new ew({})

let axios = require('axios'),
    servicePPOB = process.env.SERVICE_PPOB,
    serviceTransaction = process.env.SERVICE_TR

const eWallet_direct = process.env.E_WALLET_REDIRECT
module.exports = {
    async createEw(req, res) {
        try {
            let {
                    orderID,
                    channelCode,
                    phoneNumber,
                    totalPayment,
                    customerName,
                    typeOrder,
                    inquiryId,
                } = req.body,
                propertiesvalue = ''
            if (channelCode === 'OVO') {
                propertiesvalue = { mobileNumber: phoneNumber }
            }
            if (
                channelCode === 'DANA' ||
                channelCode === 'SHOPEEPAY' ||
                channelCode === 'LINKAJA'
            ) {
                propertiesvalue = {
                    successRedirectURL: eWallet_direct,
                }
            }
            await eWallet
                .createEWalletCharge({
                    referenceID: orderID,
                    currency: 'IDR',
                    amount: totalPayment,
                    checkoutMethod: 'ONE_TIME_PAYMENT',
                    channelCode: 'ID_' + channelCode,
                    channelProperties: propertiesvalue,
                })
                .then(async (results) => {
                    let accNumber = '',
                        linkBayar = null
                    if (channelCode === 'DANA' || channelCode === 'LINKAJA') {
                        linkBayar = results.actions.desktop_web_checkout_url
                    }
                    if (channelCode === 'SHOPEEPAY') {
                        linkBayar = results.actions.mobile_deeplink_checkout_url
                    }
                    if (channelCode === 'OVO') {
                        accNumber = results.channel_properties.mobile_number
                    } else {
                        accNumber = phoneNumber
                    }

                    await payment_transactions
                        .create({
                            typeOrder: typeOrder,
                            inquiryId: inquiryId,
                            referenceId: results.id,
                            orderId: results.reference_id,
                            buyerName: customerName,
                            paymentMethod: 'E Wallet',
                            channelCode: channelCode,
                            accountNumber: accNumber,
                            status: results.status,
                            total: results.charge_amount,
                            actionsEwallet: linkBayar,
                        })
                        .then((transactionResults) => {
                            return res.status(200).send({
                                status: 200,
                                success: true,
                                message: 'Success',
                                data: {
                                    typeOrder: typeOrder,
                                    paymentMethod:
                                        transactionResults.channelCode,
                                    orderID: transactionResults.orderId,
                                    urlPayment:
                                        transactionResults.actionsEwallet,
                                    total: transactionResults.total,
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
                    errors: err,
                },
            })
        }
    },

    async updateEwallet(req, res) {
        try {
            let incomeCallback = req.headers['x-callback-token'],
                validCallBack = process.env.XENDIT_CALLBACK
            if (incomeCallback === validCallBack) {
                let { id, status, voided_at, reference_id } = req.body.data
                await payment_transactions
                    .update(
                        {
                            status: status,
                            referenceId: id,
                            expiredTime: voided_at,
                        },
                        {
                            where: {
                                orderId: reference_id,
                            },
                        },
                    )
                    .then(async () => {
                        await payment_transactions
                            .findAll({
                                attributes: ['inquiryId', 'typeOrder'],
                                where: {
                                    orderId: reference_id,
                                },
                                order: [['createdAt', 'DESC']],
                                limit: 1,
                            })
                            .then(async (results) => {
                                if (status === 'FAILED') {
                                    await axios({
                                        method: 'post',
                                        url: `${serviceTransaction}transaction/services/updateTransaction`,
                                        headers: {
                                            'Content-Type': 'application/json',
                                        },
                                        data: {
                                            transactionId: reference_id,
                                            transactionStatus: 'canceled',
                                            transactionDesc:
                                                'Pembayaran gagal terverifikasi',
                                            notif_title: 'Pembayaran Gagal',
                                            notif_desc:
                                                'Pembayaran gagal. Silahkan coba kembali.',
                                            notif_clickAction: 'fffff',
                                        },
                                    })
                                } else if (status === 'SUCCEEDED') {
                                    const typeOrder = results[0].typeOrder
                                    const resinquiryId =
                                        '' + results[0].inquiryId
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
                                                    transactionId: reference_id,
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
                                                    transactionId: reference_id,
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
                                                        transactionId:
                                                            reference_id,
                                                    },
                                                })
                                            })
                                            break
                                        default:
                                            console.log(
                                                'tipe transaksi tidak diketahui',
                                            )
                                    }
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
}
