'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    // Change `picture` column to BLOB for storing image data, or STRING for URLs
    await queryInterface.changeColumn('Members', 'picture', {
      type: Sequelize.BLOB, // Use STRING if you are storing only URLs
      allowNull: true,
    });

    // Change `file` column to BLOB for storing PDF data, or STRING for URLs
    await queryInterface.changeColumn('Members', 'file', {
      type: Sequelize.BLOB, // Use STRING if you are storing only URLs
      allowNull: true,
    });
  },

  down: async (queryInterface, Sequelize) => {
    // Revert `picture` column back to STRING
    await queryInterface.changeColumn('Members', 'picture', {
      type: Sequelize.STRING,
      allowNull: true,
    });

    // Remove `file` column, or revert to STRING if necessary
    await queryInterface.changeColumn('Members', 'file', {
      type: Sequelize.STRING,
      allowNull: true,
    });
  }
};
