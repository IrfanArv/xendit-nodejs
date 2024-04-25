require('dotenv').config()

const { payment_transactions } = require('../../../models')

module.exports = {

  async checkPaymentTransaction(req, res) {
    try {
      await payment_transactions
        .findAll({
          attributes: [
            "total"
          ],
          where: {
            orderId: req.body.transactionId
          }
        })
        .then((resutls) => {
          console.log(resutls);

          return res.status(200).send({
            status: 200,
            success: true,
            message: "Success",
            data: resutls
          });
        });
    } catch (err) {
      return res.status(400).send({
        status: 400,
        success: false,
        message: "Bad Request",
        data: {
          errors: err.message,
        },
      });
    }
  }

}
