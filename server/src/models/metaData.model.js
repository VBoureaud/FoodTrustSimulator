const mongoose = require('mongoose');
const validator = require('validator');
const { toJSON, paginate } = require('./plugins');

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
      ownerHistory: {
        type: [ String ],
        default: [],
      },
      nftToken: {
        type: String,
        required: true,
        unique: true,
      },
      offerBuy: {
        type: [ String ],
        default: [],
      },
      parents: {
        type: [ String ],
        default: []
      },
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