const { Members, sequelize } = require('../../models');
const { StatusCodes } = require('http-status-codes');
const BaseError = require('../../schemas/responses/BaseError');
const fs = require('fs');
const path = require('path');

const UpdateMembers = async (id, body, files, basePath) => {
  const transaction = await sequelize.transaction();
  let pictureFile = files && files['picture'] ? files['picture'][0] : null;
  const pictureFileName = pictureFile ? `${basePath}/storage/${pictureFile.filename}` : null;

  try {
    const member = await Members.findByPk(id, { transaction });

    if (!member) {
      throw new BaseError({
        status: StatusCodes.NOT_FOUND,
        message: 'Member not found',
      });
    }

    const { code, parentName, childNim, noWhatsapp } = body;

    if (!code && !parentName && !childNim && !noWhatsapp && !pictureFileName) {
      throw new BaseError({
        status: StatusCodes.BAD_REQUEST,
        message: 'At least one of code, parentName, childNim, or noWhatsapp must be provided for update',
      });
    }

    // Delete the previous picture if a new one is uploaded
    if (pictureFile && member.picture) {
      const previousPicturePath = member.picture; 
      console.log('Previous Picture Path:', previousPicturePath); // Log previous picture path
      const previousPictureFileName = path.basename(previousPicturePath);
      const previousPictureFilePath = path.join(__dirname, '../../storage', previousPictureFileName);
      
      // Check if the file exists
      if (fs.existsSync(previousPictureFilePath)) {
        console.log('Deleting file:', previousPictureFilePath); // Log file path being deleted
        fs.unlinkSync(previousPictureFilePath);
        console.log('deleted');
      } else {
        console.log('File does not exist:', previousPictureFilePath); // Log if file does not exist
      }
    }

    // Update member with new data
    const updatedMember = await Members.update(
      {
        code: code || member.code,
        picture: pictureFileName || member.picture,
        parentName: parentName || member.parentName,
        childNim: childNim || member.childNim,
        noWhatsapp: noWhatsapp || member.noWhatsapp,
        options: body.options || member.options,
      },
      {
        where: { id },
        transaction,
      }
    );

    await transaction.commit();

    return updatedMember;
  } catch (error) {
    await transaction.rollback();

    if (files && pictureFile) {
      const pictureFilePath = path.join(__dirname, '../../storage', pictureFile.filename);
      if (fs.existsSync(pictureFilePath)) {
        fs.unlinkSync(pictureFilePath);
      }
    }

    throw new BaseError({
      status: error.status || StatusCodes.INTERNAL_SERVER_ERROR,
      message: `Failed to update member: ${error.message || error}`,
    });
  }
};

module.exports = UpdateMembers;
