'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    // Change `image` column to BLOB to store binary image data
    await queryInterface.changeColumn('Activities', 'image', {
      type: Sequelize.BLOB,
      allowNull: true,
    });
  },

  down: async (queryInterface, Sequelize) => {
    // Revert `image` column back to STRING
    await queryInterface.changeColumn('Activities', 'image', {
      type: Sequelize.STRING,
      allowNull: true,
    });
  }
};
