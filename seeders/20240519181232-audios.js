'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
    async up(queryInterface, Sequelize) {
        await queryInterface.bulkInsert('Audios', [
            { name: 'anyma.mp3', path: '/resources/anyma.mp3', createdAt: new Date(), updatedAt: new Date() },
            { name: 'sample.wav', path: '/resources/sample.wav', createdAt: new Date(), updatedAt: new Date() },
        ]);
    },

    async down(queryInterface, Sequelize) {
        await queryInterface.bulkDelete('Audios', null, {});
    }
};
