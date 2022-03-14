const mongoose = require('mongoose');
const { toJSON, paginate } = require('./plugins');

const citiesSchema = mongoose.Schema({
    country: {
      type: String,
      required: true,
    },
    name: {
      type: String,
      required: true,
    },
    lat: {
      type: String,
      required: true,
    },
    lng: {
      type: String,
      required: true,
    },
  },
);

// add plugin that converts mongoose to json
citiesSchema.plugin(toJSON);
citiesSchema.plugin(paginate);

/**
 * @typedef Cities
 */
const Cities = mongoose.model('Cities', citiesSchema);

module.exports = Cities;
