'use strict'
const { Model } = require('sequelize')
module.exports = (sequelize, DataTypes) => {
    class payment_settings extends Model {
        /**
         * Helper method for defining associations.
         * This method is not a part of Sequelize lifecycle.
         * The `models/index` file will call this method automatically.
         */
        static associate(models) {
            // define association here
        }
    }
    payment_settings.init(
        {
            id: {
                type: DataTypes.UUID,
                defaultValue: DataTypes.UUIDV4,
                primaryKey: true,
                allowNull: false,
            },
            paymentChannel: DataTypes.STRING,
            paymentLogo: DataTypes.STRING,
            channelCode: DataTypes.STRING,
            defaultFee: DataTypes.FLOAT,
            minimumAmount: DataTypes.FLOAT,
            channelFee: {
                type: DataTypes.FLOAT,
                allowNull: true,
            },
            status: DataTypes.STRING,
        },
        {
            sequelize,
            modelName: 'payment_settings',
        },
    )
    return payment_settings
}
