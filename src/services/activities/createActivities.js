const { Activities, sequelize } = require('../../models');
const { StatusCodes } = require('http-status-codes');
const BaseError = require('../../schemas/responses/BaseError');
const fs = require('fs');

const CreateActivities = async (body, files) => {
  // Start transaction
  const transaction = await sequelize.transaction();
  const imageFile = files && files['imageActivity'] ? files['imageActivity'][0] : null;

  try {
    // Validate required fields
    const { title, date } = body;
    if (!title || !date) {
      throw new BaseError({
        status: StatusCodes.BAD_REQUEST,
        message: 'Title and date are required fields',
      });
    }

    // Read image as binary data if file is provided
    let imageBuffer = null;
    if (imageFile) {
      imageBuffer = fs.readFileSync(imageFile.path); // Read as binary data

      // Delete the temporary file after reading
      fs.unlinkSync(imageFile.path);
    }

    // Create the activity record within a transaction
    const newActivity = await Activities.create(
      {
        title,
        image: imageBuffer, // Store binary data in MySQL MEDIUMBLOB
        description: body.description || '', // optional
        date,
        url: body.url || '', // optional
      },
      { transaction }
    );

    // Commit the transaction
    await transaction.commit();
    return newActivity;
  } catch (error) {
    // Rollback the transaction in case of error
    await transaction.rollback();

    // Clean up uploaded file if an error occurs
    if (files && imageFile && fs.existsSync(imageFile.path)) {
      fs.unlinkSync(imageFile.path);
    }

    // Re-throw the error for handling
    throw new BaseError({
      status: error.status || StatusCodes.INTERNAL_SERVER_ERROR,
      message: `Failed to create activity: ${error.message || error}`,
    });
  }
};

module.exports = CreateActivities;
