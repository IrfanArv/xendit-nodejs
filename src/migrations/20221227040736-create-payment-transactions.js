'use strict'
/** @type {import('sequelize-cli').Migration} */
module.exports = {
    async up(queryInterface, Sequelize) {
        await queryInterface.createTable('payment_transactions', {
            id: {
                allowNull: false,
                type: Sequelize.UUID,
                defaultValue: Sequelize.UUIDV4,
                primaryKey: true,
            },
            referenceId: {
                type: Sequelize.STRING,
            },
            orderId: {
                type: Sequelize.STRING,
            },
            paymentId: {
                type: Sequelize.STRING,
            },
            buyerName: {
                type: Sequelize.STRING,
            },
            paymentMethod: {
                type: Sequelize.STRING,
            },
            channelCode: {
                type: Sequelize.STRING,
            },
            accountNumber: {
                type: Sequelize.STRING,
            },
            actionsEwallet: {
                type: Sequelize.TEXT,
            },
            status: {
                type: Sequelize.STRING,
            },
            total: {
                type: Sequelize.FLOAT,
            },
            expiredTime: {
                type: Sequelize.DATE,
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
        await queryInterface.dropTable('payment_transactions')
    },
}
