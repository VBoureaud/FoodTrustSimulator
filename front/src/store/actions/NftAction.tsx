import {
  TYPES_NFT,
  
  GetOffers,
  GetOffersSuccess,
  GetOffersFailure,
  GetOffersPayload,
  OffersPayload,
  GetOffersFailurePayload,
  GetParents,
  GetParentsSuccess,
  GetParentsFailure,
  GetParentsPayload,
  GetParentsSuccessPayload,
  GetParentsFailurePayload,
} from "../types/NftTypes";


export function getOffers(data: GetOffersPayload): GetOffers {
  return {
    type: TYPES_NFT['GET_OFFERS'],
    payload: data,
  };
}
export function getOffersSuccess(data: OffersPayload): GetOffersSuccess {
  return {
    type: TYPES_NFT['GET_OFFERS_SUCCESS'],
    payload: data,
  };
}
export function getOffersFailure(data: GetOffersFailurePayload): GetOffersFailure {
  return {
    type: TYPES_NFT['GET_OFFERS_FAILURE'],
    payload: data,
  };
}

// get parents tree from an Uri
export function getParents(data: GetParentsPayload): GetParents {
  return {
    type: TYPES_NFT['GET_PARENTS'],
    payload: data,
  };
};
export function getParentsSuccess(data: GetParentsSuccessPayload): GetParentsSuccess {
  return {
    type: TYPES_NFT['GET_PARENTS_SUCCESS'],
    payload: data,
  };
};
export function getParentsFailure(data: GetParentsFailurePayload): GetParentsFailure {
  return {
    type: TYPES_NFT['GET_PARENTS_FAILURE'],
    payload: data,
  };
};