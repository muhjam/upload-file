const { Donations, sequelize } = require('../../models');
const { StatusCodes } = require('http-status-codes');
const BaseError = require('../../schemas/responses/BaseError');
const fs = require('fs');
const path = require('path');

const CreateDonations = async (body, files, baseUrl) => {
  const transaction = await sequelize.transaction();
  const proofFile = files && files['proof'] ? files['proof'][0] : null;

  try {
    // Validate required fields
    const { name, email, noWhatsapp, notification } = body;

    if (!name || !email || !noWhatsapp || !notification) {
      throw new BaseError({
        status: StatusCodes.BAD_REQUEST,
        message: 'Name, email, WhatsApp number, and notification type are required fields',
      });
    }

    // Construct the proof file URL if the file exists
    const proofSrc = proofFile ? `${baseUrl}/uploads/${proofFile.filename}` : null;

    // Create the donation record within a transaction
    const newDonation = await Donations.create(
      {
        name,
        email,
        noWhatsapp,
        proof: proofSrc, // Store the file URL as proof
        notification,
      },
      { transaction }
    );

    // Commit the transaction
    await transaction.commit();

    return newDonation;
  } catch (error) {
    // Rollback the transaction in case of error
    await transaction.rollback();

    // Clean up uploaded files if any errors occur
    if (proofFile) {
      fs.unlinkSync(proofFile.path); // Delete the temporary proof file if an error occurs
    }

    // Re-throw the error for handling
    throw new BaseError({
      status: error.status || StatusCodes.INTERNAL_SERVER_ERROR,
      message: `Failed to create donation: ${error.message || error}`,
    });
  }
};

module.exports = CreateDonations;
