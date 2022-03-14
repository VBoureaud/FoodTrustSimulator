const { decodeHashURI } = require('../utils');

const objectId = (value, helpers) => {
  if (!value.match(/^[0-9a-fA-F]{24}$/)) {
    return helpers.message('"{{#label}}" must be a valid mongo id');
  }
  return value;
};


const uriHash = (value, helpers) => {
  const sizeMaxAddr = 35;
  if (value.length > sizeMaxAddr + 19) {
    return helpers.message('URI must be at least ' + (sizeMaxAddr + 19) + ' characters');
  }
  if (!value.match(/^[0-9a-zA-Z]*$/)) {
    return helpers.message('URI must be a valid one.');
  }
  const decoded = decodeHashURI(value);
  if (!(decoded.date instanceof Date) || isNaN(decoded.date.valueOf())) {
    return helpers.message('URI must be a valid one.');
  }
  if (isNaN(decoded.type)) {
    return helpers.message('URI must be a valid one.');
  }
  return value;
};

const xrplAddress = (value, helpers) => {
  const sizeMaxAddr = 35;
  const sizeMinAddr = 25;
  if (value.length > sizeMaxAddr || value.length < sizeMinAddr) {
    return helpers.message('Address must be at least ' + (sizeMaxAddr + 19) + ' characters');
  }
  if (!value.match(/^[0-9a-zA-Z]*$/)) {
    return helpers.message('Address must be a valid one.');
  }
  if (value[0] != 'r') {
    return helpers.message('Address must be a valid one.');
  }
  return value;
};


module.exports = {
  objectId,
  uriHash,
  xrplAddress,
};
