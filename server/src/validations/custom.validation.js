const xrpl = require('xrpl');
const { decodeHashURI } = require('../utils');
const { profiles, configOnChain } = require('../config/gameEngine');

const objectId = (value, helpers) => {
  if (!value.match(/^[0-9a-fA-F]{24}$/)) {
    return helpers.message('"{{#label}}" must be a valid mongo id');
  }
  return value;
};


const uriHash = (value, helpers) => {
  const sizeMaxAddr = 35;
  const name = xrpl.convertHexToString(value);
  if (name.length > sizeMaxAddr + 19) {
    return helpers.message('URI must be at least ' + (sizeMaxAddr + 19) + ' characters');
  }
  if (!name.match(/^[0-9a-zA-Z]*$/)) {
    return helpers.message('URI must be a valid one.');
  }
  const decoded = decodeHashURI(name);
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

// simple check address
const xrplOffer = (value, helpers) => {
  const offer = value.split('_');
  /*if (offer.length != 2)
    return helpers.message('Offer not valid.');*/
  if (xrplAddress(offer[0], helpers) != offer[0])
    return helpers.message('Address must be a valid one.');
  return value;
}

// check if value is in allowed server
const xrplServer = (value, helpers) => {
  const names = configOnChain.filter(e => e.ready).map(e => e.name);
  if (names.indexOf(value) === -1)
    return helpers.message('Server not allowed.');
  return value;
}

const imageProfil = (value, helpers) => {
  if (value.split('-').length !== 10)
    return helpers.message('Image profil is not a valid one.');
  return value;
}

const typeName = (value, helpers) => {
  const profilesName = Object.keys(profiles);
  const key = profilesName.indexOf(value);
  if (key === -1)
    return helpers.message('Profile must be a valid one.');
  return profilesName[key];
}

const updateUriActionType = (value, helpers) => {
  if (value !== 'freeze' && value !== 'bake')
    return helpers.message('Bad action for update uri.');
  return value;
}

module.exports = {
  objectId,
  uriHash,
  xrplAddress,
  xrplServer,
  xrplOffer,
  imageProfil,
  typeName,
  updateUriActionType,
};
