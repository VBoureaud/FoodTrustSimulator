import { User } from './UserTypes';
import { Uri } from './UriTypes';

// Types
export const TYPES_NFT = {
  "GET_OFFERS": "@AccountTypes/GET_OFFERS",
  "GET_OFFERS_SUCCESS": "@AccountTypes/GET_OFFERS_SUCCESS",
  "GET_OFFERS_FAILURE": "@AccountTypes/GET_OFFERS_FAILURE",
  "GET_PARENTS": "@UriTypes/GET_PARENTS",
  "GET_PARENTS_SUCCESS": "@UriTypes/GET_PARENTS_SUCCESS",
  "GET_PARENTS_FAILURE": "@UriTypes/GET_PARENTS_FAILURE",
};

// Reducer Types
export type NFTReducerState = {
  tokenId: string;
  errorMsg: string;
  errorGetOffers: boolean;
  loadingGetOffers: boolean;
  sellOffers: Offers[];
  buyOffers: Offers[];
  name?: string; 
  parents?: Parents;
  loadingParents: boolean;
  errorParents: boolean;
};


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
export type GetParents = {
  type: typeof TYPES_NFT['GET_PARENTS'];
  payload: GetParentsPayload;
};
export type GetParentsSuccess = {
  type: typeof TYPES_NFT['GET_PARENTS_SUCCESS'];
  payload: GetParentsSuccessPayload;
};
export type GetParentsFailure = {
  type: typeof TYPES_NFT['GET_PARENTS_FAILURE'];
  payload: GetParentsFailurePayload;
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

export type GetParentsPayload = {
  name: string;
}
export type GetParentsSuccessPayload = {
  parents: Parents;
}
export type GetParentsFailurePayload = {}


// Data Types
export type Offers = {
  amount: string;
  flags: number;
  nft_offer_index: string;
  owner: string;
}
export type Parents = {
  elt: {
    uri: Uri;
    user: User;
  },
  children: Parents[];
}
