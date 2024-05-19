'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
    async up(queryInterface, Sequelize) {
        await queryInterface.bulkInsert('Images', [
            { name: 'atenea.jpeg', path: '/resources/atenea.jpeg', type: 'jpeg', createdAt: new Date(), updatedAt: new Date() },
            { name: 'basket.jpeg', path: '/resources/basket.jpeg', type: 'png', createdAt: new Date(), updatedAt: new Date() },
        ]);
    },

    async down(queryInterface, Sequelize) {
        await queryInterface.bulkDelete('Images', null, {});
    }
};