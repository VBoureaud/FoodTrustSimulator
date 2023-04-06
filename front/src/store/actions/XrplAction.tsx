import {
  TYPES_XRPL,
  SubscribeXrpl,
  SubscribeXrplSuccess,
  SubscribeXrplFailure,
  SubscribeXrplPayload,
  SubscribeXrplSuccessPayload,
  SubscribeXrplFailurePayload,
} from "../types/XrplTypes";

export function subscribeXrpl(data: SubscribeXrplPayload): SubscribeXrpl {
  return {
    type: TYPES_XRPL.SUBSCRIBE,
    payload: data,
  };
}
export function subscribeXrplSuccess(data: SubscribeXrplSuccessPayload): SubscribeXrplSuccess {
  return {
    type: TYPES_XRPL.SUBSCRIBE_SUCCESS,
    payload: data,
  };
}
export function subscribeXrplFailure(data: SubscribeXrplFailurePayload): SubscribeXrplFailure {
  return {
    type: TYPES_XRPL.SUBSCRIBE_FAILURE,
    payload: data,
  };
}
