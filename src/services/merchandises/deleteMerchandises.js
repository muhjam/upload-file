const { Merchandises, sequelize } = require('../../models');
const { StatusCodes } = require('http-status-codes');
const fs = require('fs');
const path = require('path');

const DeleteMerchandises = async (id) => {
  const transaction = await sequelize.transaction(); // Start a transaction
  try {
    // Cari merchandise berdasarkan id
    const merchandise = await Merchandises.findByPk(id, { transaction });

    // Jika merchandise tidak ditemukan, lemparkan error
    if (!merchandise) {
      throw {
        status: StatusCodes.NOT_FOUND,
        message: 'Merchandise not found',
      };
    }

    // Get the previous image path
    const previousImagePath = merchandise.image; 
    console.log('Previous Image Path:', previousImagePath); // Log previous image path
    const previousImageFileName = path.basename(previousImagePath);
    const previousImageFilePath = path.join(__dirname, '../../public/images/merchandises', previousImageFileName);
    
    // Check if the file exists and delete it
    if (fs.existsSync(previousImageFilePath)) {
      console.log('Deleting file:', previousImageFilePath); // Log file path being deleted
      fs.unlinkSync(previousImageFilePath);
      console.log('deleted');
    } else {
      console.log('File does not exist:', previousImageFilePath); // Log if file does not exist
    }

    // Hapus merchandise
    await merchandise.destroy({ transaction });

    // Commit the transaction
    await transaction.commit();

    return {
      status: StatusCodes.OK,
      message: 'Merchandise deleted successfully',
    };
  } catch (error) {
    // Rollback the transaction in case of error
    await transaction.rollback();
    throw new Error(`Failed to delete merchandise: ${error.message || error}`);
  }
};

module.exports = DeleteMerchandises;
