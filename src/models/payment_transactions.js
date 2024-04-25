'use strict'
const { Model } = require('sequelize')
module.exports = (sequelize, DataTypes) => {
    class payment_transactions extends Model {
        /**
         * Helper method for defining associations.
         * This method is not a part of Sequelize lifecycle.
         * The `models/index` file will call this method automatically.
         */
        static associate(models) {
            // define association here
        }
    }
    payment_transactions.init(
        {
            id: {
                type: DataTypes.UUID,
                defaultValue: DataTypes.UUIDV4,
                primaryKey: true,
                allowNull: false,
            },
            referenceId: DataTypes.STRING,
            orderId: DataTypes.STRING,
            typeOrder: DataTypes.STRING,
            inquiryId: DataTypes.STRING,
            paymentId: DataTypes.STRING,
            buyerName: DataTypes.STRING,
            paymentMethod: DataTypes.STRING,
            channelCode: DataTypes.STRING,
            actionsEwallet: DataTypes.TEXT,
            status: DataTypes.STRING,
            accountNumber: DataTypes.STRING,
            expiredTime: DataTypes.DATE,
            total: DataTypes.FLOAT,
            updatedAt: DataTypes.DATE,
        },
        {
            sequelize,
            modelName: 'payment_transactions',
        },
    )
    return payment_transactions
}
