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

const CreateMembers = async (body, files, baseUrl) => {
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

    // Ensure the upload directory exists
    const uploadDir = path.resolve(__dirname, '../../uploads');
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }

    // Move picture file to `uploads` directory
    let pictureFilePath = null;
    if (pictureFile) {
      pictureFilePath = path.join(uploadDir, pictureFile.filename);
      fs.renameSync(pictureFile.path, pictureFilePath);
    }

    // Move PDF file to `uploads` directory
    let pdfFilePath = null;
    if (pdfFile) {
      pdfFilePath = path.join(uploadDir, pdfFile.filename);
      fs.renameSync(pdfFile.path, pdfFilePath);
    }

    // Construct URLs for the files
    const pictureFileUrl = pictureFilePath ? `${baseUrl}/uploads/${pictureFile.filename}` : null;
    const pdfFileUrl = pdfFilePath ? `${baseUrl}/uploads/${pdfFile.filename}` : null;

    // Create the member record within a transaction
    const newMember = await Members.create(
      {
        code, // Generated code from childNim
        parentName,
        childNim,
        noWhatsapp,
        picture: pictureFileUrl, // Store the file URL
        file: pdfFileUrl, // Store the file URL
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
    if (pictureFile && fs.existsSync(pictureFile.path)) {
      fs.unlinkSync(pictureFile.path);
    }
    if (pdfFile && fs.existsSync(pdfFile.path)) {
      fs.unlinkSync(pdfFile.path);
    }

    // Re-throw the error for handling
    throw new BaseError({
      status: error.status || StatusCodes.INTERNAL_SERVER_ERROR,
      message: `Failed to create member: ${error.message || error}`,
    });
  }
};

module.exports = CreateMembers;
