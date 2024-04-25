require('dotenv').config()
const { xenditPayment } = require('../../../utils'),
    {
        payment_cc_auths,
        payment_transactions,
        buyer_users,
        transactions,
    } = require('../../../models'),
    Card = xenditPayment.Card,
    card = new Card({})

let axios = require('axios'),
    servicePPOB = process.env.SERVICE_PPOB,
    serviceTransaction = process.env.SERVICE_TR

module.exports = {
    async createToken(req, res) {
        try {
            let incomeCallback = req.headers['x-callback-token'],
                validCallBack = process.env.XENDIT_CALLBACK

            if (incomeCallback === validCallBack) {
                let { id, external_id, status } = req.body.data

                console.log('req.body.data')
                console.log(req.body.data)

                await payment_cc_auths
                    .create({
                        orderId: external_id,
                        tokenId: id,
                        token_status: status,
                        token_response: JSON.stringify(req.body.data),
                    })
                    .then(async () => {
                        transactions.belongsTo(buyer_users, {
                            foreignKey: 'userId',
                        })

                        const trans = await transactions
                            .findOne({
                                where: { id: external_id },
                                include: [
                                    {
                                        model: buyer_users,
                                        where: { isDelete: '0' },
                                        required: false,
                                    },
                                ],
                            })
                            .then(async (transResults) => {
                                return await payment_transactions
                                    .create({
                                        referenceId: id,
                                        typeOrder: transResults.flagTransaction,
                                        inquiryId: transResults.inquiryId,
                                        orderId: external_id,
                                        buyerName:
                                            transResults.buyer_user.username,
                                        paymentMethod: 'Credit Card',
                                        channelCode: transResults.channelCode,
                                        accountNumber: null,
                                        expiredTime: null,
                                        total: 0,
                                        status: status,
                                    })
                                    .then((transactionResults) => {
                                        console.log('transactionResults')
                                        console.log(transactionResults)

                                        return transactionResults
                                    })
                            })

                        return res.sendStatus(200)
                    })
            } else {
                console.log(
                    'createToken error message = token callback invalid',
                )

                return res.status(400).send({
                    status: 400,
                    message: 'token callback invalid',
                    data: { errors: 'token callback invalid' },
                })
            }
        } catch (err) {
            console.log('createToken error message = ' + err.message)
            console.log(err)

            return res.status(400).send({
                status: 400,
                success: false,
                message: 'Bad Request',
                data: { errors: err.message },
            })
        }
    },
    async createAuth(req, res) {
        try {
            let incomeCallback = req.headers['x-callback-token'],
                validCallBack = process.env.XENDIT_CALLBACK

            if (incomeCallback === validCallBack) {
                let { id, status, amount, external_id, three_ds_result } =
                    req.body.data

                console.log(req.body.data)

                await payment_cc_auths.update(
                    {
                        auth_status: status,
                        authId: id,
                        total: amount,
                        auth_response: JSON.stringify(req.body.data),
                    },
                    {
                        where: {
                            orderId: external_id,
                        },
                    },
                )

                await payment_transactions.update(
                    {
                        total: amount,
                    },
                    {
                        where: {
                            orderId: external_id,
                        },
                    },
                )

                if (status == 'VERIFIED') {
                    console.log('status VERIFIED')

                    await payment_cc_auths
                        .findAll({
                            attributes: ['tokenId', 'authId', 'total'],
                            where: { orderId: external_id },
                            order: [['createdAt', 'DESC']],
                            limit: 1,
                        })
                        .then(async (results) => {
                            console.log(results)

                            if (results[0].authId && results[0].tokenId) {
                                //do something here
                            } else {
                                return res.status(400).send({
                                    status: 400,
                                    message: 'invalid auth id and token id',
                                    data: { errors: message },
                                })
                            }

                            card.createCharge({
                                tokenID: results[0].tokenId,
                                authID: results[0].authId,
                                amount: amount,
                                // eslint-disable-next-line max-len
                                externalID: external_id, // use your system's ID of the transaction
                                capture: true,
                            }).then(async (r) => {
                                let {
                                    id,
                                    business_id,
                                    status,
                                    authorized_amount,
                                    external_id,
                                } = r

                                // eslint-disable-line no-console
                                console.log('charge created')
                                console.log(r)

                                await payment_cc_auths.update(
                                    {
                                        referenceId: business_id,
                                        status: status,
                                        charge_response: JSON.stringify(r),
                                    },
                                    {
                                        where: { orderId: external_id },
                                    },
                                )

                                if (status == 'CAPTURED') {
                                    await payment_transactions
                                        .findAll({
                                            attributes: [
                                                'inquiryId',
                                                'typeOrder',
                                                'channelCode',
                                            ],
                                            where: { orderId: external_id },
                                            order: [['createdAt', 'DESC']],
                                            limit: 1,
                                        })
                                        .then(async (results) => {
                                            if (results.length > 0) {
                                                var typeOrder = ''
                                                var resinquiryId = ''

                                                if (results[0].typeOrder) {
                                                    typeOrder =
                                                        results[0].typeOrder
                                                }

                                                if (results[0].inquiryId) {
                                                    resinquiryId =
                                                        '' +
                                                        results[0].inquiryId
                                                }

                                                var channelCode =
                                                    results[0].channelCode

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
                                                                transactionId:
                                                                    external_id,
                                                                transactionStatus:
                                                                    'paid',
                                                                transactionDesc:
                                                                    'Pembayaran telah terverifikasi',
                                                                notif_title:
                                                                    'Pembayaran Berhasil',
                                                                notif_desc:
                                                                    'Pembayaran telah terverifikasi',
                                                                notif_clickAction:
                                                                    'fffff',
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
                                                                transactionId:
                                                                    external_id,
                                                                transactionStatus:
                                                                    'paid',
                                                                transactionDesc:
                                                                    'Pembayaran telah terverifikasi',
                                                                notif_title:
                                                                    'Pembayaran Berhasil',
                                                                notif_desc:
                                                                    'Pembayaran telah terverifikasi',
                                                                notif_clickAction:
                                                                    'fffff',
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
                                                                    inquiryId:
                                                                        resinquiryId,
                                                                    transactionId:
                                                                        external_id,
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
                                }
                            })
                        })
                }

                return res.sendStatus(200)
            } else {
                console.log('createAuth error message = token callback invalid')

                return res.status(400).send({
                    status: 400,
                    message: 'token callback invalid',
                    data: { errors: 'token callback invalid' },
                })
            }
        } catch (err) {
            console.log('createAuth error message = ' + err.message)
            console.log(err)

            return res.status(400).send({
                status: 400,
                success: false,
                message: 'Bad Request',
                data: { errors: err.message },
            })
        }
    },
}
