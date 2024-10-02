'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    // Mengubah enum status pada table Transactions
    await queryInterface.changeColumn('Transactions', 'status', {
      type: Sequelize.ENUM('waiting', 'on process', 'on delivery', 'arrived', 'done', 'canceled', 'denied'),
      allowNull: false,
      defaultValue: 'waiting'
    });
  },

  async down(queryInterface, Sequelize) {
    // Mengembalikan enum status seperti sebelumnya jika ada rollback
    await queryInterface.changeColumn('Transactions', 'status', {
      type: Sequelize.ENUM('waiting', 'on progress', 'on delivery', 'arrived', 'done', 'canceled', 'denied'),
      allowNull: false,
      defaultValue: 'waiting'
    });
  }
};
