const { Members, sequelize } = require('../../models');
const { StatusCodes } = require('http-status-codes');
const fs = require('fs');
const path = require('path');

const DeleteMembers = async (id) => {
  const transaction = await sequelize.transaction(); // Start a transaction
  try {
    // Find member by id
    const member = await Members.findByPk(id, { transaction });

    // If member not found, throw an error
    if (!member) {
      throw {
        status: StatusCodes.NOT_FOUND,
        message: 'Member not found',
      };
    }

    // Get the previous picture path
    const previousPicturePath = member.picture;
    const previousPictureFileName = path.basename(previousPicturePath);
    const previousPictureFilePath = path.join(__dirname, '../../storage', previousPictureFileName);

    // Check if the file exists and delete it
    if (fs.existsSync(previousPictureFilePath)) {
      console.log('Deleting file:', previousPictureFilePath); // Log file path being deleted
      fs.unlinkSync(previousPictureFilePath);
      console.log('Deleted');
    } else {
      console.log('File does not exist:', previousPictureFilePath); // Log if file does not exist
    }

    // Delete the member
    await member.destroy({ transaction });

    // Commit the transaction
    await transaction.commit();

    return {
      status: StatusCodes.OK,
      message: 'Member deleted successfully',
    };
  } catch (error) {
    // Rollback the transaction in case of error
    await transaction.rollback();
    throw new Error(`Failed to delete member: ${error.message || error}`);
  }
};

module.exports = DeleteMembers;
