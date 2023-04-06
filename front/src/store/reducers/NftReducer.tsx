import {
  TYPES_NFT,
  NFTReducerState,
  GetOffersPayload,
  OffersPayload,
  GetOffersFailurePayload,
  GetParentsPayload,
  GetParentsSuccessPayload,
  GetParentsFailurePayload,
} from "../types/NftTypes";

import {
  TYPES_USER,
} from "../types/UserTypes";

import { createReducer } from "@utils/helpers";

const defaultState: NFTReducerState = {
  tokenId: '',
  errorMsg: '',
  errorGetOffers: false,
  loadingGetOffers: false,
  sellOffers: null,
  buyOffers: null,
  name: '',
  parents: null,
  loadingParents: false,
  errorParents: false,
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
    [TYPES_NFT.GET_PARENTS]: (state: NFTReducerState, payload: GetParentsPayload) => ({
      ...state,
      ...payload,
      loadingParents: true,
      errorParents: false,
    }),
    [TYPES_NFT.GET_PARENTS_SUCCESS]: (state: NFTReducerState, payload: GetParentsSuccessPayload) => {
      return ({
        ...state,
        ...payload,
        loadingParents: false,
        errorParents: false,
      });
    },
    [TYPES_NFT.GET_PARENTS_FAILURE]: (state: NFTReducerState, payload: GetParentsFailurePayload) => ({
      ...state,
      ...payload,
      loadingParents: false,
      errorParents: true,
    }),


    // reset
    [TYPES_USER.LOGOUT]: () => ({
      ...defaultState
    }),
  },
  defaultState
);
