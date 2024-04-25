'use strict'
const { Model } = require('sequelize')
module.exports = (sequelize, DataTypes) => {
    class payment_fee_settings extends Model {
        /**
         * Helper method for defining associations.
         * This method is not a part of Sequelize lifecycle.
         * The `models/index` file will call this method automatically.
         */
        static associate(models) {
            // define association here
        }
    }
    payment_fee_settings.init(
        {
            id: {
                type: DataTypes.INTEGER,
                primaryKey: true,
                allowNull: false,
            },
            fee_setting_name: DataTypes.STRING,
            fee_setting_status: DataTypes.STRING,
            is_active: DataTypes.STRING
        },
        {
            sequelize,
            modelName: 'payment_fee_settings',
        },
    )
    return payment_fee_settings
}
