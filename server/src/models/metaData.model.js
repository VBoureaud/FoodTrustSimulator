const mongoose = require('mongoose');
const validator = require('validator');
const { toJSON, paginate } = require('./plugins');

// Ex:
/*
  created;date;user;null
  sell;date;user;10
  destroyed;date;user;null
*/
const metaDataHistory = mongoose.Schema({
  action: {
    type: String,
    required: true,
  },
  date: {
    type: String,
    required: true,
  },
  user: {
    type: String,
    required: true,
  },
  price: {
    type: String,
  },
});

// Metadata Structure XLS-20d NFTs - Based on EIP-1155
const metaDataSchema = mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
      unique: true,
    },
    description: {
      type: String,
      required: true,
      default: '',
    },
    image: {
      type: String,
      required: true,
    },
    properties: {
      owner: {
        type: String,
        required: true,
      },
      history: [metaDataHistory],
      nftToken: {
        type: String,
        required: true,
        unique: true,
      },
      offerBuy: {
        type: [ String ], // address_price_date
        default: [],
      },
      offerSell: {
        type: [ String ], // address_price_date
        default: [],
      },
      parents: { // [ metaData.name, ... ]
        type: [ String ],
        default: []
      },
      durability: { // day available - if 0: infinity
        type: Number,
        default: 10,
      },
      power: { // power you can win if you eat it
        type: Number,
        default: 1,
      },
      details: { // empty field for details - ex recipe: typeIng1;typeIng2;typeIng3
        type: String,
        default: '',
      },
    },
    validity: {
      type: Boolean,
      default: true,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

// add plugin that converts mongoose to json
metaDataSchema.plugin(toJSON);
metaDataSchema.plugin(paginate);

/**
 * @typedef MetaData
 */
const MetaData = mongoose.model('MetaData', metaDataSchema);

module.exports = MetaData;