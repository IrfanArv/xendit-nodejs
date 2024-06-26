'use strict'
const { Model } = require('sequelize')
module.exports = (sequelize, DataTypes) => {
    class buyer_users extends Model {
        /**
         * Helper method for defining associations.
         * This method is not a part of Sequelize lifecycle.
         * The `models/index` file will call this method automatically.
         */
        static associate(models) {
            // define association here
        }
    }
    buyer_users.init(
        {
            id: {
                type: DataTypes.STRING,
                primaryKey: true,
                allowNull: false,
            },
            phone: DataTypes.STRING,
            username: DataTypes.STRING,
            email: DataTypes.STRING,
            isDelete: DataTypes.INTEGER,
            
            createdAt: DataTypes.DATE,
            updatedAt: DataTypes.DATE,
        },
        {
            sequelize,
            modelName: 'buyer_users',
        },
    )
    
    return buyer_users
}
