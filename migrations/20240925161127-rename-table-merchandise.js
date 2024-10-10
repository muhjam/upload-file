'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    // Rename the table 'Merchandise' to 'Merchandises'
    await queryInterface.renameTable('Merchandise', 'Merchandises');
  },

  async down (queryInterface, Sequelize) {
    // Revert the table name back to 'Merchandise'
    await queryInterface.renameTable('Merchandises', 'Merchandise');
  }
};
