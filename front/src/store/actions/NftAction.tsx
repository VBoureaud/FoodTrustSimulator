import {
  TYPES_NFT,
  
  GetOffers,
  GetOffersSuccess,
  GetOffersFailure,
  GetOffersPayload,
  OffersPayload,
  GetOffersFailurePayload,

  GetHistoryPayload,
  GetHistory,
  HistoryPayload,
  GetHistorySuccess,
  GetHistoryFailurePayload,
  GetHistoryFailure,
} from "../types/NftTypes";


export function getOffers(data: GetOffersPayload): GetOffers {
  return {
    type: TYPES_NFT.GET_OFFERS,
    payload: data,
  };
}
export function getOffersSuccess(data: OffersPayload): GetOffersSuccess {
  return {
    type: TYPES_NFT.GET_OFFERS_SUCCESS,
    payload: data,
  };
}
export function getOffersFailure(data: GetOffersFailurePayload): GetOffersFailure {
  return {
    type: TYPES_NFT.GET_OFFERS_FAILURE,
    payload: data,
  };
}

export function getHistory(data: GetHistoryPayload): GetHistory {
  return {
    type: TYPES_NFT['GET_HISTORY'],
    payload: data,
  }
};
export function getHistorySuccess(data: HistoryPayload): GetHistorySuccess {
  return {
    type: TYPES_NFT['GET_HISTORY_SUCCESS'],
    payload: data,
  }
};
export function getHistoryFailure(data: GetHistoryFailurePayload): GetHistoryFailure {
  return {
    type: TYPES_NFT['GET_HISTORY_FAILURE'],
    payload: data,
  }
};