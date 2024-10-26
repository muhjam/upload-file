const { Members } = require('../../models');
const { Op } = require('sequelize');

// Add an id parameter for specific member retrieval
const GetMembers = async (id = null, query = {}, search = '') => {
  // If id is provided, return the member based on the id
  if (id) {
    try {
      const member = await Members.findByPk(id); // Find by primary key (id)
      if (!member) {
        throw new Error(`Member with id ${id} not found`);
      }
      return member; // Return member details
    } catch (error) {
      throw new Error(`Failed to retrieve member data: ${error.message}`);
    }
  }

  // Logic for retrieving all members
  const page = query.page || 1;  // Get page number from query params (default is 1)
  const limit = query.limit || 10;  // Get limit from query params (default is 10)
  const offset = (page - 1) * limit;  // Calculate offset based on page and limit
  
  const options = {
    where: {},
    limit,
    offset,
    order: [['createdAt', 'DESC']],  // Sort by creation date in descending order
  };

  // If there's a search term, use it to filter by member code
  if (search) {
    options.where.code = { [Op.like]: `%${search}%` };
  }

  try {
    const { rows, count } = await Members.findAndCountAll(options);

    return {
      data: rows,
      total: count,
      currentPage: page,
      totalPages: Math.ceil(count / limit),
    };
  } catch (error) {
    throw new Error(`Failed to retrieve member data: ${error.message}`);
  }
};

module.exports = GetMembers;
