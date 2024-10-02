const { Merchandises, sequelize } = require('../../models');
const { StatusCodes } = require('http-status-codes');
const BaseError = require('../../schemas/responses/BaseError');
const fs = require('fs');
const path = require('path');

const UpdateMerchandise = async (id, body, files, basePath) => {
  const transaction = await sequelize.transaction();
  let imageFile = files && files['image'] ? files['image'][0] : null;
  const imageFileName = imageFile ? `${basePath}/public/images/merchandises/${imageFile.filename}` : null;

  try {
    const merchandise = await Merchandises.findByPk(id, { transaction });

    if (!merchandise) {
      throw new BaseError({
        status: StatusCodes.NOT_FOUND,
        message: 'Merchandise not found',
      });
    }

    const { name, price, stock } = body;

    if (!name && !price && !stock && !imageFileName) {
      throw new BaseError({
        status: StatusCodes.BAD_REQUEST,
        message: 'At least one of name, price, or stock must be provided for update',
      });
    }

    // Delete the previous image if a new one is uploaded
    if (imageFile && merchandise.image) {
      const previousImagePath = merchandise.image; 
      console.log('Previous Image Path:', previousImagePath); // Log previous image path
      const previousImageFileName = path.basename(previousImagePath);
      const previousImageFilePath = path.join(__dirname, '../../public/images/merchandises', previousImageFileName);
      
      // Check if the file exists
      if (fs.existsSync(previousImageFilePath)) {
        console.log('Deleting file:', previousImageFilePath); // Log file path being deleted
        fs.unlinkSync(previousImageFilePath);
        console.log('deleted');
      } else {
        console.log('File does not exist:', previousImageFilePath); // Log if file does not exist
      }
    }

    // Update merchandise with new data
    const updatedMerchandise = await Merchandises.update(
      {
        name: name || merchandise.name,
        image: imageFileName || merchandise.image,
        description: body.description || merchandise.description,
        price: price !== undefined ? price : merchandise.price,
        stock: stock !== undefined ? stock : merchandise.stock,
      },
      {
        where: { id },
        transaction,
      }
    );

    await transaction.commit();

    return updatedMerchandise;
  } catch (error) {
    await transaction.rollback();

    if (files && imageFile) {
      const imageFilePath = path.join(__dirname, '../../public/images/merchandises', imageFile.filename);
      if (fs.existsSync(imageFilePath)) {
        fs.unlinkSync(imageFilePath);
      }
    }

    throw new BaseError({
      status: error.status || StatusCodes.INTERNAL_SERVER_ERROR,
      message: `Failed to update merchandise: ${error.message || error}`,
    });
  }
};

module.exports = UpdateMerchandise;
