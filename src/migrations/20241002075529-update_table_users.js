'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {

    // Create the new Users table with updated fields
    await queryInterface.createTable('Users', {
      id: {
        allowNull: false,
        primaryKey: true,
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4
      },
      photo: {
        type: Sequelize.STRING,
        allowNull: true // Photo can be null if not provided
      },
      noMember: {
        type: Sequelize.STRING,
        unique: true,
        allowNull: false // Member number is required
      },
      name: {
        type: Sequelize.STRING,
        allowNull: false // Name is required
      },
      faculty: {
        type: Sequelize.STRING,
        allowNull: true // Faculty can be null if not applicable
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
    });
  },
  async down(queryInterface, Sequelize) {
    // Drop the Users table if you want to revert the changes
    await queryInterface.dropTable('Users');
  }
};
