'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class Transaction extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // Define association with Merchandise
      this.belongsTo(models.Merchandise, {
        foreignKey: 'merchandiseId',
        as: 'merchandise'
      });
    }
  }
  
  Transaction.init({
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true
    },
    code: {
      type: DataTypes.STRING,
      allowNull: false
    },
    username: {
      type: DataTypes.STRING,
      allowNull: false
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false
    },
    noTelp: {
      type: DataTypes.STRING,
      allowNull: false
    },
    address: {
      type: DataTypes.TEXT,
      allowNull: false
    },
    merchandiseId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'Merchandise', // Make sure the table name matches your actual Merchandise model
        key: 'id',
      }
    },
    qty: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    status: {
      type: DataTypes.ENUM('waiting', 'on progress', 'on delivery', 'arrived', 'done'),
      defaultValue: 'waiting',
      allowNull: false
    },
    payment: {
      type: DataTypes.STRING,
      allowNull: false
    }
  }, {
    sequelize,
    modelName: 'Transaction',
    tableName: 'Transactions',
  });

  return Transaction;
};
