const { Transactions, sequelize } = require('../../models');
const { StatusCodes } = require('http-status-codes');
const fs = require('fs');
const path = require('path');

const DeleteTransactions = async (id) => {
  const transaction = await sequelize.transaction(); // Start a transaction
  try {
    // Find transaction by id
    const transactionRecord = await Transactions.findByPk(id, { transaction });

    // If transaction not found, throw an error
    if (!transactionRecord) {
      throw {
        status: StatusCodes.NOT_FOUND,
        message: 'Transaction not found',
      };
    }

    // Get the previous payment image path
    const previousImagePath = transactionRecord.payment; 
    console.log('Previous Payment Image Path:', previousImagePath); // Log previous image path
    const previousImageFileName = path.basename(previousImagePath);
    const previousImageFilePath = path.join(__dirname, '../../public/images/transactions', previousImageFileName);
    
    // Check if the file exists and delete it
    if (fs.existsSync(previousImageFilePath)) {
      console.log('Deleting file:', previousImageFilePath); // Log file path being deleted
      fs.unlinkSync(previousImageFilePath);
      console.log('File deleted successfully');
    } else {
      console.log('File does not exist:', previousImageFilePath); // Log if file does not exist
    }

    // Delete the transaction
    await transactionRecord.destroy({ transaction });

    // Commit the transaction
    await transaction.commit();

    return {
      status: StatusCodes.OK,
      message: 'Transaction deleted successfully',
    };
  } catch (error) {
    // Rollback the transaction in case of error
    await transaction.rollback();
    throw new Error(`Failed to delete transaction: ${error.message || error}`);
  }
};

module.exports = DeleteTransactions;
