'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    return queryInterface.changeColumn('Activities', 'image', {
      type: Sequelize.BLOB('medium'),  // Use LONGBLOB instead of MEDIUMBLOB
      allowNull: true,
    });
  },

  down: async (queryInterface, Sequelize) => {
    return queryInterface.changeColumn('Activities', 'image', {
      type: Sequelize.BLOB('long'),  // You can revert to BLOB in the down migration
      allowNull: true,
    });
  },
};
