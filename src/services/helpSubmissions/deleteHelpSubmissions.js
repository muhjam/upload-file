const { HelpSubmissions, sequelize } = require('../../models');
const { StatusCodes } = require('http-status-codes');
const fs = require('fs');
const path = require('path');

const DeleteHelpSubmissions = async (id) => {
  const transaction = await sequelize.transaction(); // Start a transaction
  try {
    // Find submission by id
    const submission = await HelpSubmissions.findByPk(id, { transaction });

    // If submission not found, throw an error
    if (!submission) {
      throw {
        status: StatusCodes.NOT_FOUND,
        message: 'Help submission not found',
      };
    }

    // Get the previous toPropose file path
    const previousFilePath = submission.toPropose;
    const previousFileName = path.basename(previousFilePath);
    const previousFileFullPath = path.join(__dirname, '../../storage', previousFileName);

    // Check if the file exists and delete it
    if (fs.existsSync(previousFileFullPath)) {
      console.log('Deleting file:', previousFileFullPath); // Log file path being deleted
      fs.unlinkSync(previousFileFullPath);
      console.log('Deleted');
    } else {
      console.log('File does not exist:', previousFileFullPath); // Log if file does not exist
    }

    // Delete the submission
    await submission.destroy({ transaction });

    // Commit the transaction
    await transaction.commit();

    return {
      status: StatusCodes.OK,
      message: 'Help submission deleted successfully',
    };
  } catch (error) {
    // Rollback the transaction in case of error
    await transaction.rollback();
    throw new Error(`Failed to delete help submission: ${error.message || error}`);
  }
};

module.exports = DeleteHelpSubmissions;
