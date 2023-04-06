const httpStatus = require('http-status');
const { 
  Notifications,
} = require('../models');
const ApiError = require('../utils/ApiError');
const {
  sendNotification
} = require('../wssApp');

/**
 * Add a notification to an user
 * @param {string} address
 * @param {string} server
 * @param {string} type
 * @param {string} title
 * @param {string} desc
 * @returns {Promise<Notification>}
 */
const addNotification = async (address, server, type, title, desc) => {
  const notificationDoc = await Notifications.create({
    type,
    title,
    desc,
    address,
    server,
  });
  if (!notificationDoc)
    throw new ApiError(httpStatus.BAD_REQUEST, 'Request fail during notif add');
  await sendNotification(address, server, desc);
  return notificationDoc;
};

/**
 * Get notifications from an user
 * @param {string} address
 * @param {string} server
 * @returns {Promise<Notification>}
 */
const getNotification = async (address, server) => {
  const notifs = await Notifications.find({ address, server }).sort({_id:-1});
  return notifs.map((elt) => ({
      ...elt.toObject(),
    })
  );
};

module.exports = {
  addNotification,
  getNotification,
};
