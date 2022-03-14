const httpStatus = require('http-status');
const catchAsync = require('../utils/catchAsync');

const getHome = catchAsync(async (req, res) => {
  const data = 'Hello World';

  res.status(httpStatus.OK).send({ data });
});

module.exports = {
  getHome,
};