const { Activities, sequelize } = require('../../models');
const { StatusCodes } = require('http-status-codes');
const BaseError = require('../../schemas/responses/BaseError');
const fs = require('fs');
const path = require('path');

const UpdateActivities = async (id, body, files) => {
  const transaction = await sequelize.transaction();
  let imageFile = files && files['imageActivity'] ? files['imageActivity'][0] : null;

  try {
    const activity = await Activities.findByPk(id, { transaction });

    if (!activity) {
      throw new BaseError({
        status: StatusCodes.NOT_FOUND,
        message: 'Activity not found',
      });
    }

    const { title, date } = body;

    if (!title && !date && !imageFile && !body.description && !body.url) {
      throw new BaseError({
        status: StatusCodes.BAD_REQUEST,
        message: 'At least one of title, date, or image must be provided for update',
      });
    }

    // Read the new image as binary data if it's provided
    const imageData = imageFile ? fs.readFileSync(imageFile.path) : null;

    // Update the activity with new data
    const updatedActivity = await activity.update(
      {
        title: title || activity.title,
        image: imageData || activity.image, // Store binary data or keep existing data
        description: body.description || activity.description,
        date: date !== undefined ? date : activity.date,
        url: body.url !== undefined ? body.url : activity.url,
      },
      { transaction }
    );

    await transaction.commit();

    // Clean up temporary uploaded file if needed
    if (imageFile) {
      fs.unlinkSync(imageFile.path);
    }

    return updatedActivity;
  } catch (error) {
    await transaction.rollback();

    // Clean up temporary uploaded file in case of an error
    if (files && imageFile) {
      fs.unlinkSync(imageFile.path);
    }

    throw new BaseError({
      status: error.status || StatusCodes.INTERNAL_SERVER_ERROR,
      message: `Failed to update activity: ${error.message || error}`,
    });
  }
};

module.exports = UpdateActivities;
