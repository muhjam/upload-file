const { Donations, sequelize } = require('../../models');
const { StatusCodes } = require('http-status-codes');
const fs = require('fs');
const path = require('path');

const DeleteDonations = async (id) => {
  const transaction = await sequelize.transaction(); // Start a transaction
  try {
    // Find donation by id
    const donation = await Donations.findByPk(id, { transaction });

    // If donation not found, throw an error
    if (!donation) {
      throw {
        status: StatusCodes.NOT_FOUND,
        message: 'Donation not found',
      };
    }

    // Get the previous proof file path
    const previousProofPath = donation.proof;
    if (previousProofPath) {
      const previousProofFileName = path.basename(previousProofPath);
      const previousProofFilePath = path.join(__dirname, '../../uploads', previousProofFileName);

      // Check if the file exists and delete it
      if (fs.existsSync(previousProofFilePath)) {
        console.log('Deleting file:', previousProofFilePath); // Log file path being deleted
        fs.unlinkSync(previousProofFilePath);
        console.log('Deleted');
      } else {
        console.log('File does not exist:', previousProofFilePath); // Log if file does not exist
      }
    }

    // Delete the donation
    await donation.destroy({ transaction });

    // Commit the transaction
    await transaction.commit();

    return {
      status: StatusCodes.OK,
      message: 'Donation deleted successfully',
    };
  } catch (error) {
    // Rollback the transaction in case of error
    await transaction.rollback();
    throw new Error(`Failed to delete donation: ${error.message || error}`);
  }
};

module.exports = DeleteDonations;
