require("dotenv").config();

const { payment_settings, payment_transactions, payment_fee_settings } = require("../../models"),
  uploadFile = require("../../middleware/upload.middleware"),
  URL = process.env.URL_IMAGE


module.exports = {
  async createPayment(req, res) {
    try {
      await uploadFile(req, res);
      await payment_settings.findOne({
        where: {
          channelCode: req.body.paymentCode
        }
      })
      .then(async (checkChannel) => {
        if (checkChannel) {
          return res.status(400).send({
            status: 400,
            success: false,
            message: "Payment Channel already exists"
          });
        }

        await payment_settings.create({
          paymentChannel: req.body.paymentChannel,
          channelCode: req.body.paymentCode,
          paymentLogo: req.file.filename,
          defaultFee: req.body.defaultFee,
          channelFee: req.body.paymentFee,
          minimumAmount: req.body.minimumAmount,
          status: "active"
        })
        .then((resutls) => {
          return res.status(200).send({
            status: 200,
            success: true,
            message: "Success",
            data: {
              channelName: resutls.paymentChannel,
              channelCode: resutls.channelCode,
              channelFee: resutls.channelFee,
              minimumAmount: resutls.minimumAmount
            }
          });
        });
      });
    } catch (err) {
      if (err.code == "LIMIT_FILE_SIZE") {
        return res.status(400).send({
          message: "Ukuran file tidak boleh lebih dari 2 MB!"

        });
      }

      return res.status(400).send({
        status: 400,
        success: false,
        message: "Bad Request",
        data: {
          errors: err.message
        }
      })
    }
  },
  async getPayment(req, res) {
    console.log(' ')
    console.log('=================')
    console.log('Start Get Payment')
    console.log('=================')

    try {
      const checkFeeSettings = await payment_fee_settings.findAll({
        attributes: [
          "is_active"
        ],
        where: {
          fee_setting_name: req.params.type
        }
      });

      await Promise.all(checkFeeSettings.map(async(item_1) => {
        await payment_settings.findAll({
          attributes: [
            "paymentChannel",
            "channelCode",
            "defaultFee",
            "channelFee",
            "paymentLogo",
            "minimumAmount"
          ],
          where: {
            status: "active"
          }
        })
        .then((resutls) => {
          const data = resutls.reduce(
            (data, item_2) => ({
              ...data,
              [item_2.paymentChannel]: [
                ...(data[item_2.paymentChannel] || []),
                {
                  paymentLogo: `${URL}/assets/${item_2.paymentLogo}`,
                  channelCode: item_2.channelCode,
                  channelFee: item_2.channelFee,
                  minimumAmount: item_2.minimumAmount,
                  feeStatus: item_1.is_active
                },
              ],
            }),
            {}
          )

          return res.status(200).send({
            status: 200,
            success: true,
            message: "Success",
            data: data
          });
        });
      }));
    } catch (err) {
      console.log(err);

      return res.status(400).send({
        status: 400,
        success: false,
        message: "Bad Request",
        data: {
          errors: err.message
        }
      });
    }
  },
}

