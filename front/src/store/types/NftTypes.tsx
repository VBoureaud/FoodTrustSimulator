// Types
export const TYPES_NFT = {
  "GET_OFFERS": "@AccountTypes/GET_OFFERS",
  "GET_OFFERS_SUCCESS": "@AccountTypes/GET_OFFERS_SUCCESS",
  "GET_OFFERS_FAILURE": "@AccountTypes/GET_OFFERS_FAILURE",
  "GET_HISTORY": "@AccountTypes/GET_HISTORY",
  "GET_HISTORY_SUCCESS": "@AccountTypes/GET_HISTORY_SUCCESS",
  "GET_HISTORY_FAILURE": "@AccountTypes/GET_HISTORY_FAILURE",
};

// Reducer Types
export type NFTReducerState = {
  tokenId: string;
  errorMsg: string;
  errorGetOffers: boolean;
  loadingGetOffers: boolean;
  errorHistory: boolean;
  loadingHistory: boolean;
  history?: History;
  sellOffers: Offers[];
  buyOffers: Offers[];
};

export type Offers = {
  amount: string;
  flags: number;
  nft_offer_index: string;
  owner: string;
}

export type HistoryDetails = {
  userName: string;
  address: string;
  country: string;
  name: string;
  lat: string;
  lng: string;
}
export type History = {
  name: string;
  details: HistoryDetails[];
}

// Action Types
export type GetOffers = {
  type: typeof TYPES_NFT['GET_OFFERS'];
  payload: GetOffersPayload;
};
export type GetOffersSuccess = {
  type: typeof TYPES_NFT['GET_OFFERS_SUCCESS'];
  payload: OffersPayload;
};
export type GetOffersFailure = {
  type: typeof TYPES_NFT['GET_OFFERS_FAILURE'];
  payload: GetOffersFailurePayload;
};
export type GetHistory = {
  type: typeof TYPES_NFT['GET_HISTORY'];
  payload: GetHistoryPayload;
};
export type GetHistorySuccess = {
  type: typeof TYPES_NFT['GET_HISTORY_SUCCESS'];
  payload: HistoryPayload;
};
export type GetHistoryFailure = {
  type: typeof TYPES_NFT['GET_HISTORY_FAILURE'];
  payload: GetHistoryFailurePayload;
};

// Payload Types
export type GetOffersPayload = {
  tokenId: string;
};
export type OffersPayload = { 
  sellOffers: Offers[];
  buyOffers: Offers[];
};
export type GetOffersFailurePayload = {};
export type GetHistoryPayload = {
  tokenId: string;
};
export type HistoryPayload = { 
  history: History;
};
export type GetHistoryFailurePayload = {};