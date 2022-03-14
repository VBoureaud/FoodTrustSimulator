const httpStatus = require('http-status');
const catchAsync = require('../utils/catchAsync');
const pick = require('../utils/pick');
const { uriService } = require('../services');

const register = catchAsync(async (req, res) => {
  const uri = await uriService.register(req.body);
  res.status(httpStatus.CREATED).send({ uri });
});

const patchUri = catchAsync(async (req, res) => {
  const uri = await uriService.patchUri(req.params.name, req.body);
  res.status(httpStatus.OK).send({ uri });
});

const queryUris = catchAsync(async (req, res) => {
  const options = pick(req.query, ['sortBy', 'limit', 'page']);
  let filter = pick(req.query, ['name', 'nftToken', 'address' ]);

  if (filter && filter.nftToken) {
    filter = { ...filter, "properties.nftToken": filter.nftToken };
    delete filter["nftToken"];
  }
  if (filter && filter.address) {
    filter = { ...filter, "properties.owner": filter.address };
    delete filter["address"];
  }
  const result = await uriService.queryUris(filter, options);
  res.status(httpStatus.OK).send({ result });
});

const historyUri = catchAsync(async (req, res) => {
  const history = await uriService.historyUri(req.params.tokenId);
  res.status(httpStatus.OK).send({ history });
});

module.exports = {
  register,
  patchUri,
  queryUris,
  historyUri,
};