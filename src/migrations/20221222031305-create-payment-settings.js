'use strict'
/** @type {import('sequelize-cli').Migration} */
module.exports = {
    async up(queryInterface, Sequelize) {
        await queryInterface.createTable('payment_settings', {
            id: {
                allowNull: false,
                type: Sequelize.UUID,
                defaultValue: Sequelize.UUIDV4,
                primaryKey: true,
            },
            paymentChannel: {
                type: Sequelize.STRING,
            },
            channelCode: {
                type: Sequelize.STRING,
            },
            defaultFee: {
                type: Sequelize.FLOAT,
            },
            channelFee: {
                allowNull: true,
                type: Sequelize.FLOAT,
            },
            minimumAmount: {
                allowNull: true,
                type: Sequelize.FLOAT,
            },
            paymentLogo: {
                type: Sequelize.STRING,
            },
            status: {
                type: Sequelize.STRING,
            },
            createdAt: {
                allowNull: false,
                type: Sequelize.DATE,
            },
            updatedAt: {
                allowNull: false,
                type: Sequelize.DATE,
            },
        })
    },
    async down(queryInterface, Sequelize) {
        await queryInterface.dropTable('payment_settings')
    },
}
