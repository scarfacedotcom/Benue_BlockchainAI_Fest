'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.addConstraint('users', {
      fields: ['phone'],
      type: 'unique',
      name: 'unique_user_phone',
    });

    await queryInterface.addConstraint('users', {
      fields: ['whatsapp'],
      type: 'unique',
      name: 'unique_user_whatsapp',
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.removeConstraint('users', 'unique_user_phone');
    await queryInterface.removeConstraint('users', 'unique_user_whatsapp');
  },
};
