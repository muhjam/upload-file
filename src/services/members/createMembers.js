const { Members, sequelize } = require('../../models');
const { StatusCodes } = require('http-status-codes');
const BaseError = require('../../schemas/responses/BaseError');
const fs = require('fs');
const path = require('path');

// Helper function to reverse every two characters in a string
const generateCodeFromChildNim = (childNim) => {
  return childNim
    .match(/.{1,2}/g) // Split into pairs of characters
    .map(pair => pair.split('').reverse().join('')) // Reverse each pair
    .join(''); // Join all pairs back into a single string
};

const CreateMembers = async (body, files, basePath) => {
  const transaction = await sequelize.transaction();
  const pictureFile = files && files['picture'] ? files['picture'][0] : null;
  const picturePath = pictureFile ? `${basePath}/public/images/members/${pictureFile.filename}` : null;
  try {
    // Validate required fields
    const { parentName, childNim, noWhatsapp, staff, foster } = body;

    if (!parentName || !childNim || !noWhatsapp) {
      throw new BaseError({
        status: StatusCodes.BAD_REQUEST,
        message: 'Parent name, child NIM, and WhatsApp number are required fields',
      });
    }

    // Generate code by reversing every two characters in childNim
    const code = generateCodeFromChildNim(childNim);

    // Create the member record within a transaction
    const newMember = await Members.create(
      {
        code, // Generated code from childNim
        parentName,
        childNim,
        noWhatsapp,
        picture: picturePath, // Store the file name in the database or null if no image
        options: {
          staff: staff,
          foster: foster,
        }, // Optional JSON field
      },
      { transaction }
    );

    // Commit the transaction
    await transaction.commit();

    return newMember;
  } catch (error) {
    // Rollback the transaction in case of error
    await transaction.rollback();

    // Clean up uploaded files if any errors occur
    if (files && pictureFile) {
      const pictureFullPath = path.join(__dirname, '../../public/images/members', pictureFile.filename);
      if (fs.existsSync(pictureFullPath)) {
        fs.unlinkSync(pictureFullPath);
      }
    }

    // Re-throw the error for handling
    throw new BaseError({
      status: error.status || StatusCodes.INTERNAL_SERVER_ERROR,
      message: `Failed to create member: ${error.message || error}`,
    });
  }
};

module.exports = CreateMembers;
