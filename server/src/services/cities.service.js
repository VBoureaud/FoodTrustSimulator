const { Cities } = require('../models');

/**
 * Query Name
 * @param {Object} filter - Mongo filter
 * @param {Object} options - Query options
 * @param {string} [options.sortBy] - Sort option in the format: sortField:(desc|asc)
 * @param {number} [options.limit] - Maximum number of results per page (default = 10)
 * @param {number} [options.page] - Current page (default = 1)
 * @returns {Promise<QueryResult>}
 */
const queryName = async (filter, options) => {
  const cities = await Cities.paginate(filter, options);
  return cities;
};

module.exports = {
  queryName,
};
