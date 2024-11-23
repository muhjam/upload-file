const { HelpSubmissions } = require('../../models');
const { Op } = require('sequelize');

// Add an id parameter for specific help submission retrieval
const GetHelpSubmissions = async (id = null, query = {}, search = '') => {
  // If id is provided, return the help submission based on the id
  if (id) {
    try {
      const helpSubmission = await HelpSubmissions.findByPk(id); // Find by primary key (id)
      if (!helpSubmission) {
        throw new Error(`Help Submission with id ${id} not found`);
      }
      return helpSubmission; // Return help submission details
    } catch (error) {
      throw new Error(`Failed to retrieve help submission data: ${error.message}`);
    }
  }

  // Logic for retrieving all help submissions
  const page = query.page || 1;  // Get page number from query params (default is 1)
  const limit = query.limit || 10;  // Get limit from query params (default is 10)
  const offset = (page - 1) * limit;  // Calculate offset based on page and limit
  
  const options = {
    where: {},
    limit,
    offset,
    order: [['createdAt', 'DESC']],  // Sort by creation date in descending order
  };

  // If there's a search term, use it to filter by help submission code
  if (search) {
    options.where.code = { [Op.like]: `%${search}%` };
  }

  try {
    const { rows, count } = await HelpSubmissions.findAndCountAll(options);

    return {
      data: rows,
      total: count,
      currentPage: page,
      totalPages: Math.ceil(count / limit),
    };
  } catch (error) {
    throw new Error(`Failed to retrieve help submission data: ${error.message}`);
  }
};

module.exports = GetHelpSubmissions;
