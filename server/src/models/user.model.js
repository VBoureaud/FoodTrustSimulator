const mongoose = require('mongoose');
const { toJSON, paginate } = require('./plugins');

const userAd = mongoose.Schema({
  date: {
    type: String,
    required: true,
  },
  user: {
    type: String,
    required: true,
  },
  message: {
    type: String,
    required: true,
  },
  duree: {
    type: Number,
    default: 24 * 60 * 60000, // 24 hours to milliseconds
  },
});

const userQuest = mongoose.Schema({
  id: {
    type: Number,
    required: true,
  },
  date: {
    type: String,
    required: true,
  },
  winDate: {
    type: String,
    default: '',
  },
  tokenNeeded: {
    type: [ String ],
    required: true,
  },
});

const userSchema = mongoose.Schema({
    name: {
      type: String,
      required: true,
      trim: true,
    },
    type: { // farmer - cook - manager
      type: String,
      default: null,
    },
    image: { //concatenation of id for slider
      type: String,
      default: '0-0-0-0-0-0-0-0-0-0',
      //required: true,
    },
    address: { // xrpl addr
      type: String,
      required: true,
      unique: true,
    },
    server: { // where the xrpl addr is linked
      type: String,
      required: true,
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
    lastCo: {
      type: String,
      default: null,
    },
    quest: [userQuest],
    ad: [userAd],
    burnout: {
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
