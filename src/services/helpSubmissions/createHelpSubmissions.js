const { HelpSubmissions, sequelize } = require('../../models');
const { StatusCodes } = require('http-status-codes');
const BaseError = require('../../schemas/responses/BaseError');
const fs = require('fs');
const path = require('path');

const CreateHelpSubmissions = async (body, files, baseUrl) => {
  const transaction = await sequelize.transaction();
  const toProposeFile = files && files['file'] ? files['file'][0] : null; // Handle file for toPropose

  try {
    // Validate required fields
    const { name, nim, noWhatsapp, type, reason } = body;

    if (!name || !nim || !noWhatsapp || !type || !reason) {
      throw new BaseError({
        status: StatusCodes.BAD_REQUEST,
        message: 'Name, NIM, WhatsApp number, type, and reason are required fields',
      });
    }

    // Move the uploaded file to the `uploads` directory if it exists
    let toProposeFilePath = null;
    if (toProposeFile) {
      const uploadDir = path.resolve(__dirname, '../../uploads');
      if (!fs.existsSync(uploadDir)) {
        fs.mkdirSync(uploadDir, { recursive: true }); // Ensure the directory exists
      }

      toProposeFilePath = path.join(uploadDir, toProposeFile.filename);

      // Move file to `uploads` directory
      fs.renameSync(toProposeFile.path, toProposeFilePath);
    }

    // Construct the file URL
    const toProposeFileUrl = toProposeFilePath ? `${baseUrl}/uploads/${toProposeFile.filename}` : null;

    // Create the help submission record within a transaction
    const newHelpSubmission = await HelpSubmissions.create(
      {
        name,
        nim,
        noWhatsapp,
        type,
        reason,
        toPropose: toProposeFileUrl, // Store the file URL
      },
      { transaction }
    );

    // Commit the transaction
    await transaction.commit();

    return newHelpSubmission;
  } catch (error) {
    // Rollback the transaction in case of error
    await transaction.rollback();

    // Clean up uploaded toPropose file if any errors occur
    if (toProposeFile) {
      fs.unlinkSync(toProposeFile.path); // Delete the temporary file
    }

    // Re-throw the error for handling
    throw new BaseError({
      status: error.status || StatusCodes.INTERNAL_SERVER_ERROR,
      message: `Failed to create help submission: ${error.message || error}`,
    });
  }
};

module.exports = CreateHelpSubmissions;
