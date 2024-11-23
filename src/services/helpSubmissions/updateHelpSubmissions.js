const { HelpSubmissions, sequelize } = require('../../models');
const { StatusCodes } = require('http-status-codes');
const BaseError = require('../../schemas/responses/BaseError');
const fs = require('fs');
const path = require('path');

const UpdateHelpSubmissions = async (id, body, files, basePath) => {
  const transaction = await sequelize.transaction();
  let toProposeFile = files && files['toPropose'] ? files['toPropose'][0] : null;
  const toProposeFileName = toProposeFile ? `${basePath}/uploads/${toProposeFile.filename}` : null;

  try {
    const submission = await HelpSubmissions.findByPk(id, { transaction });

    if (!submission) {
      throw new BaseError({
        status: StatusCodes.NOT_FOUND,
        message: 'Help submission not found',
      });
    }

    const { name, nim, noWhatsapp, type, reason } = body;

    if (!name && !nim && !noWhatsapp && !type && !reason && !toProposeFileName) {
      throw new BaseError({
        status: StatusCodes.BAD_REQUEST,
        message: 'At least one of name, nim, noWhatsapp, type, reason, or toPropose must be provided for update',
      });
    }

    // Delete the previous toPropose file if a new one is uploaded
    if (toProposeFile && submission.toPropose) {
      const previousFilePath = path.join(__dirname, '../../uploads', submission.toPropose);
      
      // Check if the file exists and delete it
      if (fs.existsSync(previousFilePath)) {
        console.log('Deleting file:', previousFilePath);
        fs.unlinkSync(previousFilePath);
        console.log('deleted');
      } else {
        console.log('File does not exist:', previousFilePath);
      }
    }

    // Update the submission with new data
    const updatedSubmission = await HelpSubmissions.update(
      {
        name: name || submission.name,
        nim: nim || submission.nim,
        noWhatsapp: noWhatsapp || submission.noWhatsapp,
        type: type || submission.type,
        reason: reason || submission.reason,
        toPropose: toProposeFileName || submission.toPropose,
      },
      {
        where: { id },
        transaction,
      }
    );

    await transaction.commit();

    return updatedSubmission;
  } catch (error) {
    await transaction.rollback();

    if (files && toProposeFile) {
      const toProposeFilePath = path.join(__dirname, '../../uploads', toProposeFile.filename);
      if (fs.existsSync(toProposeFilePath)) {
        fs.unlinkSync(toProposeFilePath);
      }
    }

    throw new BaseError({
      status: error.status || StatusCodes.INTERNAL_SERVER_ERROR,
      message: `Failed to update help submission: ${error.message || error}`,
    });
  }
};

module.exports = UpdateHelpSubmissions;
