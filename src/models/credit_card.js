'use strict'
const { Model } = require('sequelize')

// by hermawan
module.exports = (sequelize, DataTypes) => {
    class payment_cc_auths extends Model {
        /**
         * Helper method for defining associations.
         * This method is not a part of Sequelize lifecycle.
         * The `models/index` file will call this method automatically.
         */
        static associate(models) {
            // define association here
        }
    }
    payment_cc_auths.init(
        {
            id: {
                type: DataTypes.UUID,
                defaultValue: DataTypes.UUIDV4,
                primaryKey: true,
                allowNull: false,
            },
            referenceId: DataTypes.STRING,
            orderId: DataTypes.STRING,
            tokenId: DataTypes.STRING,
            authId: DataTypes.STRING,
            buyerName: DataTypes.STRING,
            paymentMethod: DataTypes.STRING,
            channelCode: DataTypes.STRING,
            token_response: DataTypes.TEXT,
            auth_response: DataTypes.TEXT,
            actions3ds: DataTypes.STRING,
            auth_status: DataTypes.STRING,
            expiredTime: DataTypes.DATE,
            total: DataTypes.FLOAT,
            updatedAt: DataTypes.DATE,
            token_status: DataTypes.STRING,
            status: DataTypes.STRING,
            charge_response: DataTypes.TEXT,
        },
        {
            sequelize,
            modelName: 'payment_cc_auths',
        },
    )
    return payment_cc_auths
}
