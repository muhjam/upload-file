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

const CreateMembers = async (body, files) => {
  const transaction = await sequelize.transaction();
  const pictureFile = files && files['picture'] ? files['picture'][0] : null;
  const pdfFile = files && files['file'] ? files['file'][0] : null; // Add handling for the PDF file

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

    // Read the image file as binary data if it exists
    const pictureData = pictureFile ? fs.readFileSync(pictureFile.path) : null;
    
    // Read the PDF file as binary data if it exists
    const pdfData = pdfFile ? fs.readFileSync(pdfFile.path) : null;

    // Create the member record within a transaction
    const newMember = await Members.create(
      {
        code, // Generated code from childNim
        parentName,
        childNim,
        noWhatsapp,
        picture: pictureData, // Store the binary image data in the database
        file: pdfData, // Store the binary PDF data in the database
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
    if (files) {
      if (pictureFile) fs.unlinkSync(pictureFile.path); // Delete the temporary picture file if an error occurs
      if (pdfFile) fs.unlinkSync(pdfFile.path); // Delete the temporary PDF file if an error occurs
    }

    // Re-throw the error for handling
    throw new BaseError({
      status: error.status || StatusCodes.INTERNAL_SERVER_ERROR,
      message: `Failed to create member: ${error.message || error}`,
    });
  }
};

module.exports = CreateMembers;
