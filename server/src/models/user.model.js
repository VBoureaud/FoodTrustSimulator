const mongoose = require('mongoose');
const { toJSON, paginate } = require('./plugins');

const userSchema = mongoose.Schema({
    name: {
      type: String,
      required: true,
      trim: true,
    },
    profile: {
      type: String,
      default: null,
    },
    address: {
      type: String,
      required: true,
      unique: true,
    },
    experience: {
      type: Number,
      required: true,
      default: 0,
    },
    pocket: {
      type: Number,
      required: true,
      default: 7,
    },
    transactions: {
      type: Number,
      required: true,
      default: 0,
    },
    tokenBuildable: {
      type: [ String ],
      default: [],
    },
    tokenNeeded: {
      type: [ String ],
      default: [],
    },
    location: {
      name: {
        type: String,
        default: 'Geneve'
      },
      lat: {
        type: String,
        default: '46.20222',
      },
      lng: {
        type: String,
        default: '6.14569',
      },
      country: {
        type: String,
        default: 'CH',
      },
    },
  }, {
    timestamps: true,
  }
);

// add plugin that converts mongoose to json
userSchema.plugin(toJSON);
userSchema.plugin(paginate);

/**
 * @typedef User
 */
const User = mongoose.model('User', userSchema);

module.exports = User;
