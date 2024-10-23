const { Activities, sequelize } = require('../../models');
const { StatusCodes } = require('http-status-codes');
const fs = require('fs');
const path = require('path');

const DeleteActivity = async (id) => {
  const transaction = await sequelize.transaction(); // Start a transaction
  try {
    // Cari activity berdasarkan id
    const activity = await Activities.findByPk(id, { transaction });

    // Jika activity tidak ditemukan, lemparkan error
    if (!activity) {
      throw {
        status: StatusCodes.NOT_FOUND,
        message: 'Activity not found',
      };
    }

    // Get the previous image path
    const previousImagePath = activity.image; 
    console.log('Previous Image Path:', previousImagePath); // Log previous image path
    const previousImageFileName = path.basename(previousImagePath);
    const previousImageFilePath = path.join(__dirname, '../../public/images/activities', previousImageFileName);
    
    // Check if the file exists and delete it
    if (fs.existsSync(previousImageFilePath)) {
      console.log('Deleting file:', previousImageFilePath); // Log file path being deleted
      fs.unlinkSync(previousImageFilePath);
      console.log('deleted');
    } else {
      console.log('File does not exist:', previousImageFilePath); // Log if file does not exist
    }

    // Hapus activity
    await activity.destroy({ transaction });

    // Commit the transaction
    await transaction.commit();

    return {
      status: StatusCodes.OK,
      message: 'Activity deleted successfully',
    };
  } catch (error) {
    // Rollback the transaction in case of error
    await transaction.rollback();
    throw new Error(`Failed to delete activity: ${error.message || error}`);
  }
};

module.exports = DeleteActivity;
