const { Donations, sequelize } = require('../../models');
const { StatusCodes } = require('http-status-codes');
const BaseError = require('../../schemas/responses/BaseError');
const fs = require('fs');
const path = require('path');

const UpdateDonations = async (id, body, files, basePath) => {
  const transaction = await sequelize.transaction();
  let proofFile = files && files['proof'] ? files['proof'][0] : null;
  const proofFilePath = proofFile ? `${basePath}/uploads/${proofFile.filename}` : null;

  try {
    const donation = await Donations.findByPk(id, { transaction });

    if (!donation) {
      throw new BaseError({
        status: StatusCodes.NOT_FOUND,
        message: 'Donation not found',
      });
    }

    const { name, email, noWhatsapp, notification } = body;

    if (!name && !email && !noWhatsapp && !notification && !proofFilePath) {
      throw new BaseError({
        status: StatusCodes.BAD_REQUEST,
        message: 'At least one of name, email, noWhatsapp, notification, or proof must be provided for update',
      });
    }

    // Delete the previous proof file if a new one is uploaded
    if (proofFile && donation.proof) {
      const previousProofPath = donation.proof;
      const previousProofFileName = path.basename(previousProofPath);
      const previousProofFilePath = path.join(__dirname, '../../uploads', previousProofFileName);

      if (fs.existsSync(previousProofFilePath)) {
        fs.unlinkSync(previousProofFilePath);
      }
    }

    // Update donation with new data
    const updatedDonation = await Donations.update(
      {
        name: name || donation.name,
        email: email || donation.email,
        noWhatsapp: noWhatsapp || donation.noWhatsapp,
        notification: notification || donation.notification,
        proof: proofFilePath || donation.proof,
      },
      {
        where: { id },
        transaction,
      }
    );

    await transaction.commit();

    return updatedDonation;
  } catch (error) {
    await transaction.rollback();

    // Rollback file upload if the transaction fails
    if (files && proofFile) {
      const failedProofFilePath = path.join(__dirname, '../../uploads', proofFile.filename);
      if (fs.existsSync(failedProofFilePath)) {
        fs.unlinkSync(failedProofFilePath);
      }
    }

    throw new BaseError({
      status: error.status || StatusCodes.INTERNAL_SERVER_ERROR,
      message: `Failed to update donation: ${error.message || error}`,
    });
  }
};

module.exports = UpdateDonations;
