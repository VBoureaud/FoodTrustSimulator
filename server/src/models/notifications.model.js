const mongoose = require('mongoose');
const { toJSON, paginate } = require('./plugins');

const notificationsSchema = mongoose.Schema({
    type: {
      type: Number,
      required: true,
    },
    title: {
      type: String,
      default: null,
      required: true,
      trim: true,
    },
    desc: {
      type: String,
      default: null,
      trim: true,
    },
    address: {
			type: String,
			required: true,
		},
    server: {
			type: String,
			required: true,
		},
  }, {
    timestamps: true,
  }
);

// add plugin that converts mongoose to json
notificationsSchema.plugin(toJSON);
notificationsSchema.plugin(paginate);

/**
 * @typedef User
 */
const Notifications = mongoose.model('Notifications', notificationsSchema);

module.exports = Notifications;
