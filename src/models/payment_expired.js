'use strict'
const { Model } = require('sequelize')
module.exports = (sequelize, DataTypes) => {
    class payment_expired extends Model {
        /**
         * Helper method for defining associations.
         * This method is not a part of Sequelize lifecycle.
         * The `models/index` file will call this method automatically.
         */
        static associate(models) {
            // define association here
        }
    }
    payment_expired.init(
        {
            id: {
                allowNull: false,
                autoIncrement: true,
                primaryKey: true,
                type: DataTypes.INTEGER,
            },
            transaction_type: DataTypes.STRING,
            expired_time_interval: DataTypes.STRING,
            created_at: {
                type: DataTypes.DATE,
                field: 'created_at',
            },
            updated_at: {
                type: DataTypes.DATE,
                field: 'updated_at',
            },
        },
        {
            sequelize,
            modelName: 'payment_expired',
            tableName: 'payment_expired',
            timestamps: true,
            createdAt: 'created_at',
            updatedAt: 'updated_at',
        },
    )
    return payment_expired
}
