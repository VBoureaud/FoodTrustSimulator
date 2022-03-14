import {
  TYPES_NFT,
  NFTReducerState,
  GetOffersPayload,
  OffersPayload,
  GetOffersFailurePayload,
  GetHistoryPayload,
  HistoryPayload,
  GetHistoryFailurePayload,
} from "../types/NftTypes";

import {
  TYPES_ACCOUNT,
} from "../types/AccountTypes";

import { createReducer } from "@utils/helpers";

const defaultState: NFTReducerState = {
  tokenId: '',
  errorMsg: '',
  errorGetOffers: false,
  loadingGetOffers: false,
  errorHistory: false,
  loadingHistory: false,
  history: null,
  sellOffers: null,
  buyOffers: null,
};

export const nftReducer = createReducer(
  {
    [TYPES_NFT.GET_OFFERS]: (state: NFTReducerState, payload: GetOffersPayload) => ({
      ...state,
      ...payload,
      loadingGetOffers: true,
      errorGetOffers: false,
    }),
    [TYPES_NFT.GET_OFFERS_SUCCESS]: (state: NFTReducerState, payload: OffersPayload) => ({
      ...state,
      ...payload,
      loadingGetOffers: false,
      errorGetOffers: false,
    }),
    [TYPES_NFT.GET_OFFERS_FAILURE]: (state: NFTReducerState, payload: GetOffersFailurePayload) => ({
      ...state,
      ...payload,
      loadingGetOffers: false,
      errorGetOffers: true,
    }),
    [TYPES_NFT.GET_HISTORY]: (state: NFTReducerState, payload: GetHistoryPayload) => ({
      ...state,
      ...payload,
      history: {},
      loadingHistory: true,
      errorHistory: false,
    }),
    [TYPES_NFT.GET_HISTORY_SUCCESS]: (state: NFTReducerState, payload: HistoryPayload) => ({
      ...state,
      ...payload,
      loadingHistory: false,
      errorHistory: false,
    }),
    [TYPES_NFT.GET_HISTORY_FAILURE]: (state: NFTReducerState, payload: GetHistoryFailurePayload) => ({
      ...state,
      ...payload,
      loadingHistory: false,
      errorHistory: true,
    }),

    [TYPES_ACCOUNT.LOGOUT]: () => ({
      ...defaultState
    }),
  },
  defaultState
);
